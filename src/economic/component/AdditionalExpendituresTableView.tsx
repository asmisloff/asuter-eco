import React from 'react';
import { StringStateInput } from './CapacityParamsView';
import economicSlice from 'economic/slice';
import { useAppDispatch } from 'store';
import { AdditionalExpendituresTableState } from 'economic/model/additional-expendures';
import { CapitalExpendituresRowState, CapitalExpendituresTableState } from 'economic/model/capital-expenditures';

export const AdditionalExpendituresTableView = (props: { tbl: AdditionalExpendituresTableState, capitalTbl: CapitalExpendituresTableState }) => {
    const dispatch = useAppDispatch()
    return (
        <div>
            <h2>Капитальные затраты</h2>
            <table>
                <thead>
                    <tr>
                        <th>Оборудование</th>
                        <th>Тип</th>
                        <th>Стоимость</th>
                        <th>Количество</th>
                        <th>Срок службы</th>
                        <th>
                            <button onClick={() => dispatch(economicSlice.actions.insertAdditionalExpendituresRow(0))}
                            >+</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.tbl.rows.map((row, idx) => {
                        return (
                            <tr key={row.handle}>
                                {/* <td>
                                    <StringStateInput
                                        state={row.expendureItem}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, equipment: v }))}
                                    />
                                </td> */}
                                <td>
                                    <select value={row.equipment} onChange={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx, equipment: v.target.value }))}>
                                        {uniqueEquipmentNames(row.equipment, props.capitalTbl.rows).map((name, i) => {
                                            return (
                                                <option key={name} value={name}>{name}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                                <td>
                                    {/* <StringStateInput
                                        state={row.price}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, price: v }))}
                                    /> */}
                                </td>
                                <td>
                                    {/* <StringStateInput
                                        state={row.qty}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, qty: v }))}
                                    /> */}
                                </td>
                                <td>
                                    {/* <StringStateInput
                                        state={row.serviceLife}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, serviceLife: v }))}
                                    /> */}
                                </td>
                                <td>
                                    {/* <button
                                        onClick={() => dispatch(economicSlice.actions.insertAdditionalExpendituresRow(idx + 1))}
                                    >+</button>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.deleteAdditionalExpendituresRow(idx))}
                                    >-</button>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.duplicateAdditionalExpendituresRow(idx))}
                                    >c</button> */}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

function uniqueEquipmentNames(current: string, arr: CapitalExpendituresRowState[]): string[] {
    const names = arr.map(row => row.equipment.value)
    names.splice(0, 0, '')
    names.push(current)
    return Array.from(new Set(names))
}