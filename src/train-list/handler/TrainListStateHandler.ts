import { TrainList } from "../model";
import { TrainDto } from "../dto";
import { StateHandler, Status } from "../../common/verifiable";
import { TrainStateHandler } from "./TrainStateHandler";
import { TrainCharacteristicStateHandler } from "./TrainCharacteristicStateHandler";

/**
 * Handler верхнего уравня. Инкапсулирует логику управления состоянием списка поездов.
 * Здесь собраны все интерфейсные методы, которые вызываются компонентами GUI. С другой стороны
 * компонентам GUI не следует использовать никакие другие методы и функции для работы с состоянием.
 */
export class TrainListStateHandler extends StateHandler<TrainList, TrainDto[]> {
  /** Мы не хотим проблем с дублированием handle-ов, поэтому Singleton. */
  private constructor() {
    super();
  }

  static readonly instance = new TrainListStateHandler();

  /** Счетчик объектов TrainList. */
  private static cnt = Number.MIN_SAFE_INTEGER;

  private trainHandler = TrainStateHandler.instance;
  private chHandler = TrainCharacteristicStateHandler.instance;

  fromDto(dto: TrainDto[]): TrainList {
    return {
      handle: TrainListStateHandler.cnt++,
      trains: dto.map((t) => this.trainHandler.fromDto(t)),
      selectedTrainIdx: -1,
      status: Status.Ok
    };
  }

  toDto(tgt: TrainList): TrainDto[] {
    if (tgt.status > Status.Warning) {
      console.log(tgt.status);
      throw new Error("Не сериализуемо");
    }
    return tgt.trains.map((t) => this.trainHandler.toDto(t));
  }

  validate(tgt: TrainList): Status {
    this.reset(tgt);
    for (const t of tgt.trains) {
      tgt.status = Math.max(tgt.status, t.status);
    }
    return tgt.status;
  }

  /** Создать TrainList по умолчанию. */
  createInstance(): TrainList {
    const tl = {
      handle: TrainListStateHandler.cnt++,
      trains: [],
      selectedTrainIdx: -1,
      status: Status.Ok
    };
    this.insertTrain(tl, 0);
    return tl;
  }

  /**
   * Изменить один или несколько параметров характеристики.
   * @param tgt целевой объект.
   * @param characteristicIdx индекс характеристики в массиве характеристик целевого объекта.
   * @param kwargs параметры для изменения. Если параметр пропущен, он не изменяется.
   */
  updateCharacteristic(
    tgt: TrainList,
    characteristicIdx: number,
    kwargs: { speed?: string; force?: string; amp?: string }
  ): TrainList {
    const train = tgt.trains[tgt.selectedTrainIdx];
    const ch = train.characteristics[characteristicIdx];
    train.characteristics[characteristicIdx] = this.chHandler.copy(ch, kwargs);
    this.trainHandler.validate(train);
    this.validate(tgt);
    return tgt;
  }

  /**
   * Вставить новую харакетристику в массив характеристик выбранного поезда (TrainList.selectedTrainIdx).
   * @param tgt целевой объект.
   * @param pos индекс для вставки в массив характеристик.
   */
  insertCharacteristicIntoSelectedTrain(
    tgt: TrainList,
    pos: number
  ): TrainList {
    const train = tgt.trains[tgt.selectedTrainIdx];
    this.trainHandler.insertCharacteristic(train, pos, {});
    this.validate(tgt);
    return tgt;
  }

  /**
   * Удалить характеристику из массива характеристие выбранного поезда (TrainList.selectedTrainIdx).
   * @param tgt целевой объект.
   * @param pos индекс для удаления.
   */
  removeCharacteristicFromSelectedTrain(
    tgt: TrainList,
    pos: number
  ): TrainList {
    const train = tgt.trains[tgt.selectedTrainIdx];
    this.trainHandler.removeCharacteristic(train, pos);
    this.validate(tgt);
    return tgt;
  }

  /**
   * Создать и вставить новый поезд в список поездов целевого объекта.
   * @param tgt целевой объект.
   * @param pos индекс для вставки.
   */
  insertTrain(tgt: TrainList, pos: number): TrainList {
    const newTrain = this.trainHandler.createInstance({
      description: "Описание"
    });
    newTrain.name = `Поезд №${newTrain.handle}`;
    tgt.trains.splice(pos, 0, newTrain);
    this.validate(tgt);
    return tgt;
  }

  /**
   * Удалить поезд из списка поездов целевого объекта.
   * @param tgt целевой объект.
   * @param pos индекс для удаления.
   */
  removeTrain(tgt: TrainList, pos: number): TrainList {
    tgt.trains.splice(pos, 1);
    if (tgt.trains.length === 0) {
      this.insertTrain(tgt, 0);
    } else {
      this.validate(tgt);
    }
    return tgt;
  }
}
