import * as taxes from 'economic/model/rates'
import React, { memo } from 'react'
import { StringStateInput } from './CapacityParamsView'
import { EfficiencyComputationMainHandler } from 'economic/handler/EfficiencyComputationMainHandler'
import economicSlice from 'economic/slice'
import { useAppDispatch } from 'store'

export const RatesView = (props: { rates: taxes.RatesState }) => {
  const h = EfficiencyComputationMainHandler.getInstance()
  const dispatch = useAppDispatch()
  return (
    <div>
      <h2>Ставки</h2>
      <StringStateInput
        state={props.rates.profitRateForCargoTurnover}
        label='Доходная ставка за грузооборот, руб / 1000 т·км брутто'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ profitRateForCargoTurnover: v }))}
      />
      <StringStateInput
        state={props.rates.spendingRateForEconomicTasks}
        label='Расходная ставка для экономических задач, руб / 1000 т·км брутто'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ spendingRateForEconomicTasks: v }))}
      />
      <StringStateInput
        state={props.rates.reducedEnergyConsumption}
        label='Снижение энергопотребления благодаря проводимым мероприятиям, %'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ reducedEnergyConsumption: v }))}
      />
      <StringStateInput
        state={props.rates.electricityCostPerTraction}
        label='Стоимость электроэнергии на тягу, руб / кВт·ч'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ electricityCostPerTraction: v }))}
      />
      <StringStateInput
        state={props.rates.incomeTax}
        label='Налог на прибыль, %'
        placeholder={h.ratesHandler.DEFAULT_INCOME_TAX.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ incomeTax: v }))}
      />
      <StringStateInput
        state={props.rates.propertyTax}
        label='Налог на имущество, %'
        placeholder={h.ratesHandler.DEFAULT_PROPERTY_TAX.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ propertyTax: v }))}
      />
      <StringStateInput
        state={props.rates.socialTax}
        label='Единый социальный налог, %'
        placeholder={h.ratesHandler.DEFAULT_SOCIAL_TAX.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ socialTax: v }))}
      />
      <div style={{ display: 'inline-block' }}>
        <StringStateInput
          state={props.rates.discountRate}
          label='Ставка дисконтирования, %'
          onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ discountRate: v }))}
        />
        <input name='coef' value={h.ratesHandler.discountCoefficient(props.rates)} disabled />
        <label htmlFor="coef">- Коэффициент дисконтирования</label>
      </div>
      <StringStateInput
        state={props.rates.annualInflationRate}
        label='Годовой темп инфляции, %'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ annualInflationRate: v }))}
      />
      <StringStateInput
        state={props.rates.annualSalaryIndexation}
        label='Годовая индексация заработной платы, %'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ annualSalaryIndexation: v }))}
      />
      <StringStateInput
        state={props.rates.annualIncreaseInElectricityTariff}
        label='Годовой рост тарифа на электроэнергию, %'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ annualIncreaseInElectricityTariff: v }))}
      />
      <StringStateInput
        state={props.rates.calculationPeriod}
        label='Расчетный период, лет'
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ calculationPeriod: v }))}
      />
    </div>
  )
}
