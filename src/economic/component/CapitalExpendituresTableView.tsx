import { CapitalExpendituresTableState } from 'economic/model/capital-expenditures';
import React from 'react';
import { StringStateInput } from './CapacityParamsView';
import economicSlice from 'economic/slice';
import { useAppDispatch } from 'store';

export const CapitalExpendituresTableView = (props: { tbl: CapitalExpendituresTableState }) => {
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
                            <button onClick={() => dispatch(economicSlice.actions.insertCapitalExpendituresRow(0))}
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
                                        state={row.equipment}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateCapitalExpendituresRow({ idx: idx, equipment: v }))}
                                    />
                                </td>
                                <td>
                                    <StringStateInput
                                        state={row.type}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateCapitalExpendituresRow({ idx: idx, type: v }))}
                                    />
                                </td>
                                <td>
                                    <StringStateInput
                                        state={row.price}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateCapitalExpendituresRow({ idx: idx, price: v }))}
                                    />
                                </td>
                                <td>
                                    <StringStateInput
                                        state={row.qty}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateCapitalExpendituresRow({ idx: idx, qty: v }))}
                                    />
                                </td>
                                <td>
                                    <StringStateInput
                                        state={row.serviceLife}
                                        placeholder={''}
                                        onBlur={v => dispatch(economicSlice.actions.updateCapitalExpendituresRow({ idx: idx, serviceLife: v }))}
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.insertCapitalExpendituresRow(idx + 1))}
                                    >+</button>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.deleteCapitalExpendituresRow(idx))}
                                    >-</button>
                                    <button
                                        onClick={() => dispatch(economicSlice.actions.duplicateCapitalExpendituresRow(idx))}
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