import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler';
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler';
import { StringStringStateHandler } from 'common/number-state-handler/StringStringStateHandler';
import { StateHandler, Status } from 'common/verifiable';
import { CapitalExpendituresRowDto, CapitalExpendituresRowKwArgs, CapitalExpendituresRowState, CapitalExpendituresTableState } from 'economic/model/capital-expenditures';

export class CapitalExpendituresStateHandler extends StateHandler<CapitalExpendituresTableState, CapitalExpendituresRowDto[]> {
    private rowCnt = Number.MIN_SAFE_INTEGER

    readonly equipmentHandler = new StringStringStateHandler(5, 50)
    readonly equipmentTypeHandler = new StringStringStateHandler(0, 50)
    readonly priceHandler = new FloatStringStateHandler(0, 10e6, 2, true)
    readonly qtyHandler = new IntStringStateHandler(1, 1e3, true)
    readonly serviceLifeHandler = new IntStringStateHandler(1, 100, true)

    fromDto(dto: CapitalExpendituresRowDto[]): CapitalExpendituresTableState {
        throw new Error('Method not implemented.');
    }

    toDto(state: CapitalExpendituresTableState): CapitalExpendituresRowDto[] {
        throw new Error('Method not implemented.');
    }

    validate(tgt: CapitalExpendituresTableState): Status {
        this.reset(tgt)
        for (const row of tgt.rows) {
            this.transferStatus(tgt, row.equipment)
            this.transferStatus(tgt, row.type)
            this.transferStatus(tgt, row.price)
            this.transferStatus(tgt, row.qty)
            this.transferStatus(tgt, row.serviceLife)
        }
        return tgt.status
    }

    createDefault(): CapitalExpendituresTableState {
        const tbl: CapitalExpendituresTableState = {
            rows: [],
            handle: this.cnt++,
            status: Status.Ok
        }
        this.insertRow(tbl, 0, {})
        return tbl
    }

    updateRow(tgt: CapitalExpendituresTableState, idx: number, kwargs: CapitalExpendituresRowKwArgs) {
        const row = tgt.rows[idx]
        if (!row) {
            throw new Error(`Ошибка индексации строк в таблице кап. затрат. Index: ${idx}; size: ${tgt.rows.length}`)
        }
        row.equipment = this.equipmentHandler.createOrDefault(kwargs.equipment, row.equipment)
        row.type = this.equipmentTypeHandler.createOrDefault(kwargs.type, row.type)
        row.price = this.priceHandler.createOrDefault(kwargs.price?.toString(), row.price)
        row.qty = this.qtyHandler.createOrDefault(kwargs.qty?.toString(), row.qty)
        row.serviceLife = this.serviceLifeHandler.createOrDefault(kwargs.serviceLife?.toString(), row.serviceLife)
        this.validate(tgt)
    }

    insertRow(tgt: CapitalExpendituresTableState, idx: number, kwargs: CapitalExpendituresRowKwArgs): CapitalExpendituresRowState {
        const row: CapitalExpendituresRowState = {
            handle: this.rowCnt++,
            equipment: this.equipmentHandler.create(kwargs.equipment),
            type: this.equipmentTypeHandler.create(kwargs.type),
            price: this.priceHandler.create(kwargs.price?.toString()),
            qty: this.qtyHandler.create(kwargs.qty?.toString()),
            serviceLife: this.serviceLifeHandler.create(kwargs.serviceLife?.toString()),
            status: Status.Ok
        }
        tgt.rows = tgt.rows.slice()
        tgt.rows.splice(idx, 0, row)
        this.validate(tgt)
        return row
    }

    deleteRow(tgt: CapitalExpendituresTableState, idx: number) {
        tgt.rows.splice(idx, 1)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
    }

    duplicateRow(tgt: CapitalExpendituresTableState, idx: number) {
        const src = tgt.rows[idx]
        const kwargs: CapitalExpendituresRowKwArgs = {
            equipment: src.equipment.value,
            type: src.type.value,
            price: src.price.value,
            qty: src.qty.value,
            serviceLife: src.serviceLife.value
        }
        this.insertRow(tgt, idx + 1, kwargs)
    }
}