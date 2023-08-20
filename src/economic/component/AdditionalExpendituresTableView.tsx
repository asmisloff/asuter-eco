import { StringStateInput, getStyle } from './CapacityParamsView'
import economicSlice from 'economic/slice'
import { useAppDispatch } from 'store'
import { AdditionalExpendituresTableState } from 'economic/model/additional-expendures'
import { CapitalExpendituresTableState } from 'economic/model/capital-expenditures'
import { EfficiencyComputationMainHandler } from 'economic/handler/EfficiencyComputationMainHandler'
import React from 'react'

export function AdditionalExpendituresTableView(props: { tbl: AdditionalExpendituresTableState, capitalTbl: CapitalExpendituresTableState }) {
  const dispatch = useAppDispatch()
  const h = EfficiencyComputationMainHandler.getInstance()
  return (
    <div>
      <h2>Дополнительные затраты</h2>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Статья расходов</th>
            <th rowSpan={2}>Оборудование</th>
            <th rowSpan={2}>Стоимость</th>
            <th rowSpan={2}>Количество</th>
            <th colSpan={2}>Характер расходов</th>
            <th rowSpan={2}>
              <button onClick={() => dispatch(economicSlice.actions.insertAdditionalExpendituresRow(0))}
              >+</button>
            </th>
          </tr>
          <tr>
            <th>единовременные</th>
            <th>годовые</th>
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
                  <input
                    type='radio'
                    name={`${row.handle}`}
                    value='ONETIME'
                    checked={row.period === 'ONETIME'}
                    onClick={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx, period: 'ONETIME' }))}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type='radio'
                    name={`${row.handle}`}
                    value='ANNUAL'
                    checked={row.period === 'ANNUAL'}
                    onClick={v => dispatch(economicSlice.actions.updateAdditionalExpendituresRow({ idx, period: 'ANNUAL' }))}
                    readOnly
                  />
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
