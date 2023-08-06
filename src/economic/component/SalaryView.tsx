import { SalaryStateTable } from 'economic/model/salary'
import { useAppDispatch } from 'store'
import React from 'react'
import { StringStateInput, getStyle } from './CapacityParamsView'
import economicSlice from 'economic/slice'
import { EconomicStateHandler } from 'economic/handler/ActionsEffectivenessStateHandler'
import { CapitalExpendituresTableState } from 'economic/model/capital-expenditures'

export const SalaryView = (props: { tbl: SalaryStateTable, capitalTbl: CapitalExpendituresTableState }) => {
  const dispatch = useAppDispatch()
  const h = EconomicStateHandler.getInstance()
  return (
    <div>
      <h2>Оплата труда</h2>
      <table>
        <thead>
          <tr>
            <th>Работник</th>
            <th>Оборудование</th>
            <th>Число работников</th>
            <th>Часовая тарифная ставка</th>
            <th>Годовая выработка</th>
            <th>Стимулирующие выплаты</th>
            <th>
              <button onClick={() => dispatch(economicSlice.actions.insertSalaryRow(0))}
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
                    state={row.employee}
                    placeholder={''}
                    onBlur={v => dispatch(economicSlice.actions.updateSalaryRow({ idx: idx, employee: v }))}
                  />
                </td>
                <td>
                  <select
                    value={row.equipment.value}
                    onChange={v => dispatch(economicSlice.actions.updateSalaryRow({ idx, equipment: v.target.value }))}
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
                    state={row.qty}
                    placeholder={''}
                    onBlur={v => dispatch(economicSlice.actions.updateSalaryRow({ idx: idx, qty: v }))}
                  />
                </td>
                <td>
                  <StringStateInput
                    state={row.hourlyRate}
                    placeholder={''}
                    onBlur={v => dispatch(economicSlice.actions.updateSalaryRow({ idx: idx, hourlyRate: v }))}
                  />
                </td>
                <td>
                  <StringStateInput
                    state={row.annualOutput}
                    placeholder={''}
                    onBlur={v => dispatch(economicSlice.actions.updateSalaryRow({ idx: idx, annualOutput: v }))}
                  />
                </td>
                <td>
                  <StringStateInput
                    state={row.motivation}
                    placeholder={''}
                    onBlur={v => dispatch(economicSlice.actions.updateSalaryRow({ idx: idx, motivation: v }))}
                  />
                </td>
                <td>
                  <button
                    onClick={() => dispatch(economicSlice.actions.insertSalaryRow(idx + 1))}
                  >+</button>
                  <button
                    onClick={() => dispatch(economicSlice.actions.deleteSalaryRow(idx))}
                  >-</button>
                  <button
                    onClick={() => dispatch(economicSlice.actions.duplicateSalaryRow(idx))}
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