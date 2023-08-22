import { useAppDispatch, useAppSelector } from '../../store'
import { CapacityParamsView, StringStateInput, TextArea } from './CapacityParamsView'
import { CapitalExpendituresView } from './CapitalExpendituresView'
import { ParallelScheduleParamsView } from './ParallelScheduleParamsView'
import React, { memo, useEffect } from 'react'
import { AdditionalExpendituresView } from './AdditionalExpendituresView'
import { SalaryView } from './SalaryView'
import { RatesView } from './Rates'
import { EfficiencyComputationMainHandler } from 'economic/handler/EfficiencyComputationMainHandler'
import { Status } from 'common/verifiable'
import { useDispatch } from 'react-redux'
import economicSlice from 'economic/slice'

export default function Root() {
  const state = useAppSelector((state) => state.economic)
  const dispatch = useAppDispatch()
  const h = EfficiencyComputationMainHandler.getInstance()
  
  useEffect(() => {
    dispatch(economicSlice.actions.fromDto(
      {
        id: 12,
        name: 'qwrrt',
        description: '',
        trackId: 1,
        trackName: 'Участок',
        trackLength: 100,
        capacityComputationBefore: {
          id: 1,
          name: 'Пропускная-1',
          schemaId: 1,
          trainWeightMaximum: 9000,
          trainInterval: 16,
          trainQty: 145
        },
        capacityComputationAfter: {
          id: 1,
          name: 'Пропускная-1',
          schemaId: 1,
          trainWeightMaximum: 9000,
          trainInterval: 16,
          trainQty: 145
        },
        parallelComputationBefore: {
          id: 1,
          name: 'Нагрузочная-1',
          schemaId: 1,
          energyConsumptionCalculated: 1300,
          calculationDuration: 120,
          energyConsumption: 15600
        },
        parallelComputationAfter: {
          id: 1,
          name: 'Нагрузочная-1',
          schemaId: 1,
          energyConsumptionCalculated: 1300,
          calculationDuration: 120,
          energyConsumption: 15600
        },
        inputData: {
          trainWeightMaximum: 12,
          trainIntervalBefore: 1,
          trainIntervalAfter: 11,
          trainQtyBefore: 1,
          trainQtyAfter: 1,
          energyConsumptionBefore: 15660,
          energyConsumptionAfter: 16600,
          capitalInvestments: [
            {
              equipment: '2wwee',
              equipmentType: 'qwqw',
              price: 12,
              amount: 12,
              serviceLife: 1
            }
          ],
          additionalExpenditures: [],
          maintenanceSalaries: [],
          profitOptions: {
            profitRateForCargoTurnover: 1,
            spendingRateForEconomicTasks: 1,
            reducedEnergyConsumption: 1,
            electricityCostPerTraction: 1
          },
          taxRates: {
            incomeTax: 20,
            propertyTax: 2.2,
            unifiedSocialTax: 30.4
          },
          inflation: {
            discountRate: 10,
            annualInflationRate: 5,
            annualSalaryIndexation: 5,
            annualIncreaseInElectricityTariff: 5
          },
          calculationPeriod: 5
        }
      }
    ))
  }, [])
  
  return (
    <>
      <div>
        <StringStateInput
          state={state.name}
          onBlur={v => dispatch(economicSlice.actions.updateName(v))}
          label='Наименование расчёта'
        />
        <StringStateInput
          state={state.description}
          onBlur={v => dispatch(economicSlice.actions.updateDescription(v))}
          label='Примечание'
        />
      </div>
      <div>
        <h2>Участок</h2>
        <p>
          Текстовые поля предназначены для ручного ввода объектов в формате JSON. В рабочем
          варианте эти объекты будут приходить по сети как результаты запросов к API, и согласованность
          их структуры будет обеспечена системой типов Kotlin-а. Здесь поэтому коректность структуры
          не проверяется. Если она все же не корректна (вследствие ошибки при ручном вводе), это
          приведет к неопределенному поведению.
        </p>
        <p>
          Если JSON не валиден (то есть в нем есть синтаксические ошибки,
          и стандартная функция JSON.parse выбрасывает исключение), результатом его разбора
          (неудачного) будет null.
        </p>
        <TextArea
          obj={state.track}
          onBlur={obj => dispatch(economicSlice.actions.updateTrack(obj))}
          required
        />
      </div>
      <MCapacityParamsView capacity={state.capacity} isTrackSelected={state.track !== null} />
      <ParallelScheduleParamsView
        sch={state.parallelSchedule}
        isOldCapacitySelected={state.capacity.oldCapacityDto !== null}
        isNewCapacitySelected={state.capacity.newCapacityDto !== null}
      />
      <MCapitalExpendituresView tbl={state.capitalExpenditures} />
      <MAdditionalExpendituresView tbl={state.additionalExpenditures} capitalTbl={state.capitalExpenditures} />
      <MSalaryView tbl={state.salary} capitalTbl={state.capitalExpenditures} />
      <MRatesView rates={state.rates} />
      <button
        onClick={() => console.log(h.toDto(state))}
        disabled={state.status > Status.Warning}
        title={h.logErrors(state)}
      >toDto</button>
    </>
  )
}

const MCapacityParamsView = memo(CapacityParamsView)
const MParallelScheduleParamsView = memo(ParallelScheduleParamsView)
const MCapitalExpendituresView = memo(CapitalExpendituresView)
const MAdditionalExpendituresView = memo(AdditionalExpendituresView)
const MSalaryView = memo(SalaryView)
const MRatesView = memo(RatesView)