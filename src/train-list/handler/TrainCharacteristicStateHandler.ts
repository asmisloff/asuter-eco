import { StateHandler, Status } from "../../common/verifiable";
import { TrainCharacteristicDto } from "../dto";
import { TrainCharacteristic } from "../model";
import {
  AmperageStateHandler,
  ForceStateHandler,
  SpeedStateHandler
} from "./primitiveStateHandlers";

/**
 * Инкапсулирует логику управления состоянием поездной характеристики.
 */
export class TrainCharacteristicStateHandler extends StateHandler<
  TrainCharacteristic,
  TrainCharacteristicDto
> {
  /** Мы не хотим проблем с дублированием handle-ов, поэтому Singleton. */
  private constructor() {
    super();
  }

  static readonly instance = new TrainCharacteristicStateHandler();

  /** Счетчик объектов TrainCharacteristic. */
  private static cnt: number = Number.MIN_SAFE_INTEGER;

  private hSpeed = SpeedStateHandler.instance;
  private hForce = ForceStateHandler.instance;
  private hAmp = AmperageStateHandler.instance;

  fromDto(dto: TrainCharacteristicDto): TrainCharacteristic {
    const ch = {
      handle: TrainCharacteristicStateHandler.cnt++,
      speed: this.hSpeed.create(dto.speed.toString()),
      force: this.hForce.create(dto.force.toString()),
      engineAmperage: this.hAmp.create(dto.engineAmperage?.toString() ?? ""),
      status: Status.Ok
    };
    this.validate(ch);
    return ch;
  }

  toDto(tgt: TrainCharacteristic): TrainCharacteristicDto {
    if (tgt.status > Status.Warning) {
      throw new Error("Не сериализуемо");
    }
    return {
      speed: +tgt.speed.value,
      force: +tgt.force.value,
      engineAmperage: +tgt.engineAmperage.value
    };
  }

  validate(tgt: TrainCharacteristic): Status {
    this.reset(tgt);
    for (const field of [tgt.speed, tgt.force, tgt.engineAmperage]) {
      if (field.status > Status.Ok) {
        const m =
          field.status === Status.Warning ? this.addWarning : this.addError;
        m(tgt, field.what!);
      }
    }
    return tgt.status;
  }

  /**
   * Создать и валидировать новый объект TrainCharacteristic.
   * @param kwargs хранимые значения для составляющих характеристики.
   */
  createInstance(kwargs: {
    speed?: string;
    force?: string;
    amp?: string;
  }): TrainCharacteristic {
    const ch = {
      handle: TrainCharacteristicStateHandler.cnt++,
      speed: this.hSpeed.create(kwargs.speed),
      force: this.hForce.create(kwargs.force),
      engineAmperage: this.hAmp.create(kwargs.amp),
      status: Status.Ok
    };
    this.validate(ch);
    return ch;
  }

  /**
   * Созлать копию целевого объекта.
   * @param tgt целевой объект.
   * @param kwargs хранимые значения для составляющих копии. Если какое-либо из полей
   * пропущено, значение будет взято из целевого объекта.
   */
  copy(
    tgt: TrainCharacteristic,
    kwargs: { speed?: string; force?: string; amp?: string }
  ): TrainCharacteristic {
    const cp = {
      handle: TrainCharacteristicStateHandler.cnt++,
      speed: this.hSpeed.copy(tgt.speed, kwargs.speed),
      force: this.hForce.copy(tgt.force, kwargs.force),
      engineAmperage: this.hAmp.copy(tgt.engineAmperage, kwargs.amp),
      status: Status.Ok
    };
    this.validate(cp);
    return cp;
  }
}
