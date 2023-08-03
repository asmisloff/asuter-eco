import { StringState } from "../../common/StringStateHandler";
import { Status } from "../../common/verifiable";
import { useAppDispatch } from "../../store";
import trainsSlice from "../slice";

const StringStateInput = (props: {
  obj: StringState;
  onBlur: (value: string) => void;
}) => {
  const { obj: ss, onBlur } = props;
  return (
    <input
      key={ss.handle}
      type="text"
      style={{
        backgroundColor: ss.status === Status.Ok ? "" : "pink",
        width: "70px"
      }}
      defaultValue={props.obj.value}
      title={ss.what?.join("\n") ?? ""}
      onBlur={(e) => onBlur(e.target.value)}
    />
  );
};

export const TrainCharacteristicRow = (props: {
  speed: StringState;
  force: StringState;
  amp: StringState;
  trainIdx: number;
  charIdx: number;
}) => {
  const dispatch = useAppDispatch();
  const onBlur = (kwargs: { speed?: string; force?: string; amp?: string }) => {
    const speedChanged =
      kwargs.speed != null && kwargs.speed !== props.speed.value;
    const forceChanged =
      kwargs.force != null && kwargs.force !== props.force.value;
    const ampChanged = kwargs.amp != null && kwargs.amp !== props.amp.value;
    if (speedChanged || forceChanged || ampChanged)
      dispatch(
        trainsSlice.actions.updateCharacteristic({
          trainIdx: props.trainIdx,
          charIdx: props.charIdx,
          args: kwargs
        })
      );
  };
  return (
    <tr>
      <td>
        <StringStateInput
          obj={props.speed}
          onBlur={(speed) => onBlur({ speed })}
        />
      </td>
      <td>
        <StringStateInput
          obj={props.force}
          onBlur={(force) => onBlur({ force })}
        />
      </td>
      <td>
        <StringStateInput obj={props.amp} onBlur={(amp) => onBlur({ amp })} />
      </td>
      <td>
        <button
          onClick={() =>
            dispatch(
              trainsSlice.actions.insertCharacteristic({
                pos: props.charIdx + 1
              })
            )
          }
        >
          +
        </button>
        <button
          onClick={() =>
            dispatch(
              trainsSlice.actions.removeCharacteristic({ pos: props.charIdx })
            )
          }
        >
          -
        </button>
      </td>
    </tr>
  );
};
