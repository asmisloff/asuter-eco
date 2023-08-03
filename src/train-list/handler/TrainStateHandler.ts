import { StateHandler, Status } from "../../common/verifiable";
import { TrainDto } from "../dto";
import { Train, TrainCharacteristic } from "../model";
import { TrainCharacteristicStateHandler } from "./TrainCharacteristicStateHandler";

/** Инкапсулирует логику управления верифицируемым состоянием поезда (Train). */
export class TrainStateHandler extends StateHandler<Train, TrainDto> {
  /** Мы не хотим проблем с дублированием handle-ов, поэтому Singleton. */
  private constructor() {
    super();
  }

  static readonly instance = new TrainStateHandler();
  private static cnt = Number.MIN_SAFE_INTEGER;

  private chHandler = TrainCharacteristicStateHandler.instance;

  fromDto(dto: TrainDto): Train {
    const t = {
      handle: TrainStateHandler.cnt++,
      name: dto.name,
      description: dto.description,
      characteristics: dto.characteristics.map((ch) =>
        this.chHandler.fromDto(ch)
      ),
      status: Status.Ok
    };
    this.validate(t);
    return t;
  }

  toDto(tgt: Train): TrainDto {
    if (tgt.status > Status.Warning) {
      throw new Error("Не сериализуемо");
    }
    return {
      name: tgt.name,
      description: tgt.description,
      characteristics: tgt.characteristics.map((ch) => this.chHandler.toDto(ch))
    };
  }

  /**
   * Создать новый поезд.
   * @param kwargs параметры поезда. Если параметр пропущен, будет использовано значение по умолчанию.
   */
  createInstance(kwargs: { name?: string; description?: string }): Train {
    const train = {
      handle: TrainStateHandler.cnt++,
      name: kwargs.name ?? "",
      description: kwargs.description ?? "",
      characteristics: [this.chHandler.createInstance({})],
      status: Status.Ok
    };
    this.validate(train);
    return train;
  }

  validate(tgt: Train): Status {
    this.reset(tgt);
    this.check(
      tgt,
      tgt.characteristics.length > 0,
      Status.Error,
      "Пустой список характеристик"
    );
    for (const ch of tgt.characteristics) {
      if (ch.status > Status.Ok) {
        const m =
          ch.status === Status.Warning ? this.addWarning : this.addError;
        m(tgt, ch.what!);
      }
    }
    return tgt.status;
  }

  /**
   * Создать копию поезда.
   * @param tgt целевой объект.
   * @param args параметры копии. Пропущенные параметры взять из целевого объекта.
   */
  copy(
    tgt: Train,
    kwargs: {
      name?: string;
      description?: string;
      characteristics?: TrainCharacteristic[];
    }
  ): Train {
    throw new Error("Not implemented");
  }

  /**
   * Удалить характеристику из поезда.
   * @param tgt целевой объект
   * @param pos индекс для удаления
   */
  removeCharacteristic(tgt: Train, pos: number) {
    tgt.characteristics.splice(pos, 1);
    if (tgt.characteristics.length === 0) {
      this.insertCharacteristic(tgt, 0, {});
    } else {
      this.validate(tgt);
    }
  }

  /**
   * Вставить новую характеристику в список характеристик поезда.
   * @param tgt целевой объект
   * @param pos индекс для удаления
   */
  insertCharacteristic(
    tgt: Train,
    pos: number,
    kwargs: { speed?: string; force?: string; amp?: string }
  ) {
    tgt.characteristics.splice(pos, 0, this.chHandler.createInstance(kwargs));
    this.validate(tgt);
  }
}
