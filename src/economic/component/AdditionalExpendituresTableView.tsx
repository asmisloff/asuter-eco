import React from 'react';
import { StringStateInput, getStyle } from './CapacityParamsView';
import economicSlice from 'economic/slice';
import { useAppDispatch } from 'store';
import { AdditionalExpendituresTableState } from 'economic/model/additional-expendures';
import { CapitalExpendituresRowState, CapitalExpendituresTableState } from 'economic/model/capital-expenditures';
import { EconomicStateHandler } from 'economic/handler/ActionsEffectivenessStateHandler';

export const AdditionalExpendituresTableView = (props: { tbl: AdditionalExpendituresTableState, capitalTbl: CapitalExpendituresTableState }) => {
    const dispatch = useAppDispatch()
    const h = EconomicStateHandler.getInstance()
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
                                <td>
                                    <StringStateInput
                                        state={row.expendureItem}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, expendureItem: v }))}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={row.equipment.value}
                                        onChange={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx, equipment: v.target.value }))}
                                        style={getStyle(row.equipment.status)}
                                        title={row.equipment.what?.join('\n') ?? ''}
                                    >
                                        {h.uniqueEquipmentNames(row.equipment.value, props.capitalTbl.rows).map((name, i) => {
                                            return (
                                                <option key={name} value={name}>{name}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                                <td>
                                    <StringStateInput
                                        state={row.price}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, price: v }))}
                                    />
                                </td>
                                <td>
                                    <StringStateInput
                                        state={row.qty}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx: idx, qty: v }))}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={row.period}
                                        onChange={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx, period: v.target.value as 'OneTime' | 'Yearly' }))}
                                    >
                                        <option key={'OneTime'} value={'OneTime'}>{'OneTime'}</option>
                                        <option key={'Yearly'} value={'Yearly'}>{'Yearly'}</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.insertAdditionalExpendituresRow(idx + 1))}
                                    >+</button>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.deleteAdditionalExpendituresRow(idx))}
                                    >-</button>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.duplicateAdditionalExpendituresRow(idx))}
                                    >c</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
