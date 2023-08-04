import { FloatStringStateHandler } from 'common/number-state-handler/FloatStringStateHandler';
import { IntStringStateHandler } from 'common/number-state-handler/IntStringStateHandler';
import { StringStringStateHandler } from 'common/number-state-handler/StringStringStateHandler';
import { StateHandler, Status } from 'common/verifiable';
import { AdditionalExpendituresRowDto, AdditionalExpendituresRowKwArgs, AdditionalExpendituresRowState, AdditionalExpendituresTableState } from 'economic/model/additional-expendures';

export class AdditionalExpendituresStateHandler extends StateHandler<AdditionalExpendituresTableState, AdditionalExpendituresRowDto[]> {
    private rowCnt = Number.MIN_SAFE_INTEGER

    readonly expItemHandler = new StringStringStateHandler(0, 50)
    readonly priceHandler = new FloatStringStateHandler(0, 10e6, 2, true)
    readonly qtyHandler = new IntStringStateHandler(1, 1e3, true)

    fromDto(dto: AdditionalExpendituresRowDto[]): AdditionalExpendituresTableState {
        throw new Error('Method not implemented.');
    }

    toDto(state: AdditionalExpendituresTableState): AdditionalExpendituresRowDto[] {
        throw new Error('Method not implemented.');
    }

    validate(tgt: AdditionalExpendituresTableState): Status {
        this.reset(tgt)
        for (const row of tgt.rows) {
            this.transferStatus(tgt, row.expendureItem)
            this.transferStatus(tgt, row.price)
            this.transferStatus(tgt, row.qty)
        }
        return tgt.status
    }

    createDefault(): AdditionalExpendituresTableState {
        const tbl: AdditionalExpendituresTableState = {
            rows: [],
            handle: this.cnt++,
            status: Status.Ok
        }
        this.insertRow(tbl, 0, {})
        return tbl
    }

    updateRow(tgt: AdditionalExpendituresTableState, idx: number, kwargs: AdditionalExpendituresRowKwArgs) {
        const row = tgt.rows[idx]
        if (!row) {
            throw new Error(`Ошибка индексации строк в таблице кап. затрат. Index: ${idx}; size: ${tgt.rows.length}`)
        }
        row.expendureItem = this.expItemHandler.createOrDefault(kwargs.equipment, row.expendureItem)
        row.price = this.priceHandler.createOrDefault(kwargs.price?.toString(), row.price)
        row.qty = this.qtyHandler.createOrDefault(kwargs.qty?.toString(), row.qty)
        row.equipment = kwargs.equipment ?? row.equipment
        row.period = kwargs.period ?? row.period
        console.log(row.equipment)
        this.validate(tgt)
    }

    insertRow(tgt: AdditionalExpendituresTableState, idx: number, kwargs: AdditionalExpendituresRowKwArgs): AdditionalExpendituresRowState {
        const row: AdditionalExpendituresRowState = {
            handle: this.rowCnt++,
            expendureItem: this.expItemHandler.create(kwargs.expendureItem),
            equipment: '',
            price: this.priceHandler.create(kwargs.price?.toString()),
            qty: this.qtyHandler.create(kwargs.qty?.toString()),
            period: 'OneTime',
            status: Status.Ok
        }
        tgt.rows = tgt.rows.slice()
        tgt.rows.splice(idx, 0, row)
        this.validate(tgt)
        return row
    }

    deleteRow(tgt: AdditionalExpendituresTableState, idx: number) {
        tgt.rows.splice(idx, 1)
        tgt.rows = tgt.rows.slice()
        this.validate(tgt)
    }

    duplicateRow(tgt: AdditionalExpendituresTableState, idx: number) {
        const src = tgt.rows[idx]
        const kwargs: AdditionalExpendituresRowKwArgs = {
            expendureItem: src.expendureItem.value,
            equipment: src.equipment,
            price: src.price.value,
            qty: src.qty.value,
            period: src.period
        }
        this.insertRow(tgt, idx + 1, kwargs)
    }
}