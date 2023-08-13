import * as taxes from 'economic/model/taxes'
import React from 'react'
import { StringStateInput } from './CapacityParamsView'
import { EconomicStateHandler } from 'economic/handler/ActionsEffectivenessStateHandler'
import economicSlice from 'economic/slice'
import { useAppDispatch } from 'store'

export const RatesView = (props: { rates: taxes.RatesState }) => {
  const h = EconomicStateHandler.getInstance()
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
        state={props.rates.unifiedSocialTax}
        label='Единый социальный налог, %'
        placeholder={h.ratesHandler.DEFAULT_UNIFIED_SOCIAL_TAX.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ unifiedSocialTax: v }))}
      />
      <div style={{display: 'inline-block'}}>
        <StringStateInput
          state={props.rates.discountRate}
          label='Ставка дисконтирования, %'
          placeholder={h.ratesHandler.DEFAULT_DISCOUNT_RATE.toString()}
          onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ discountRate: v }))}
        />
        <input name='coef' value={h.ratesHandler.discountCoefficient(props.rates)} disabled />
        <label htmlFor="coef">- Коэффициент дисконтирования</label>
      </div>
      <StringStateInput
        state={props.rates.annualInflationRate}
        label='Годовой темп инфляции, %'
        placeholder={h.ratesHandler.DEFAULT_DISCOUNT_RATE.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ annualInflationRate: v }))}
      />
      <StringStateInput
        state={props.rates.annualSalaryIndexation}
        label='Годовая индексация заработной платы, %'
        placeholder={h.ratesHandler.DEFAULT_ANNUAL_SALARY_INDEXATION.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ annualSalaryIndexation: v }))}
      />
      <StringStateInput
        state={props.rates.annualIncreaseInElectricityTariff}
        label='Годовой рост тарифа на электроэнергию, %'
        placeholder={h.ratesHandler.DEFAULT_ANNUAL_INCREASE_IN_ELECTRICITY_TARIFF.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ annualIncreaseInElectricityTariff: v }))}
      />
      <StringStateInput
        state={props.rates.calculationPeriod}
        label='Расчетный период, лет'
        placeholder={h.ratesHandler.DEFAULT_CALC_PERIOD.toString()}
        onBlur={(v: string) => dispatch(economicSlice.actions.updateRates({ calculationPeriod: v }))}
      />
    </div>
  )
}