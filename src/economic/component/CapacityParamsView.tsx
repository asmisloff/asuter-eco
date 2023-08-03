import { CSSProperties } from "react";
import { StringState } from "../../common/StringStateHandler";
import { Status } from "../../common/verifiable";
import { useAppDispatch } from "../../store";
import { CapacityParamsState } from "../model/capacity-params";
import { EconomicStateHandler } from "../model/economic";
import economicSlice from "../slice";
import "./style.css";

export function getStyle(status: Status): CSSProperties {
  let color = "";
  if (status === Status.Error) {
    color = "pink";
  } else if (status === Status.Warning) {
    color = "lightyellow";
  }
  return {
    backgroundColor: color
  };
}

const CapacityEntryView = (props: {
  state: StringState;
  label: string;
  placeholder: string;
  onBlur: (v: string) => void;
}) => {
  return (
    <div>
      <input
        key={props.state.handle}
        name="mass"
        type="text"
        defaultValue={props.state.value}
        style={getStyle(props.state.status)}
        className={"warning"}
        title={props.state.what?.join("\n") ?? ""}
        placeholder={props.placeholder}
        onBlur={(e) => props.onBlur(e.target.value)}
      />
      <label htmlFor="mass"> - {props.label}</label>
    </div>
  );
};

export const CapacityParamsView = (props: {
  capacity: CapacityParamsState;
}) => {
  const {
    oldCapacityInfo,
    newCapacityInfo,
    maxTrainMass,
    oldInterval,
    newInterval,
    oldTrainQty,
    newTrainQty
  } = props.capacity;
  const dispatch = useAppDispatch();
  const h = EconomicStateHandler.getInstance();
  return (
    <div>
      <textarea
        defaultValue={JSON.stringify(oldCapacityInfo)}
        onBlur={(e) =>
          dispatch(
            economicSlice.actions.update_capacityParams({
              oldCapacityInfo: JSON.parse(e.target.value)
            })
          )
        }
      />
      <textarea
        defaultValue={JSON.stringify(newCapacityInfo)}
        onBlur={(e) =>
          dispatch(
            economicSlice.actions.update_capacityParams({
              newCapacityInfo: JSON.parse(e.target.value)
            })
          )
        }
      />
      <CapacityEntryView
        state={maxTrainMass}
        label={"Масса"}
        placeholder={
          h.capacityHandler.defaultMass(props.capacity)?.toString() ?? ""
        }
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.update_capacityParams({ maxTrainMass: v })
          )
        }
      />
      <CapacityEntryView
        state={oldInterval}
        label={"Старый интервал"}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.update_capacityParams({ oldInterval: v })
          )
        }
      />
      <CapacityEntryView
        state={newInterval}
        label={"Новый интервал"}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.update_capacityParams({ newInterval: v })
          )
        }
      />
      <CapacityEntryView
        state={oldTrainQty}
        label={"Старое количество"}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.update_capacityParams({ oldTrainQty: v })
          )
        }
      />
      <CapacityEntryView
        state={newTrainQty}
        label={"Новое количество"}
        onBlur={(v) =>
          dispatch(
            economicSlice.actions.update_capacityParams({ newTrainQty: v })
          )
        }
      />
    </div>
  );
};
