import { CapacityParamsStateHandler } from 'economic/handler/CapacityParamsStateHandler';
import { StateHandler, Status, Verifiable } from '../../common/verifiable';
import { CapacityParamsDto, CapacityParamsState, CapacityParamsStateHandlerKwArgs } from './capacity-params';

interface EconomicDto {
  capacity: CapacityParamsDto;
}

interface EconomicState extends Verifiable {
  capacity: CapacityParamsState;
}

export class EconomicStateHandler extends StateHandler<EconomicState, EconomicDto> {

  readonly capacityHandler = new CapacityParamsStateHandler();

  private constructor() {
    super();
  }

  private static _instance?: EconomicStateHandler = undefined;
  static getInstance(): EconomicStateHandler {
    if (!EconomicStateHandler._instance) {
      EconomicStateHandler._instance = new EconomicStateHandler();
    }
    return EconomicStateHandler._instance;
  }

  fromDto(dto: EconomicDto): EconomicState {
    throw new Error('Method not implemented.');
  }

  toDto(state: EconomicState): EconomicDto {
    throw new Error('Method not implemented.');
  }

  validate(tgt: EconomicState): Status {
    throw new Error('Method not implemented.');
  }

  createDefault(): EconomicState {
    return {
      handle: this.cnt++,
      status: Status.Ok,
      capacity: this.capacityHandler.create({})
    };
  }

  updateCapacityParams(
    tgt: EconomicState,
    kwargs: CapacityParamsStateHandlerKwArgs
  ) {
    this.capacityHandler.update(tgt.capacity, kwargs);
    this.capacityHandler.validate(tgt.capacity);
  }
}
