import { Status } from "../../common/verifiable";
import { useAppDispatch } from "../../store";
import trainsSlice from "../slice";
import { Train } from "../model";

export const TrainRow = (props: {
  item: Train;
  idx: number;
  selected: boolean;
}) => {
  const dispatch = useAppDispatch();
  const statusMark = {
    backgroundColor: props.item.status === Status.Ok ? "" : "pink"
  };
  const selectedMark = { fontWeight: props.selected ? "bold" : "" };
  const selectThis = () => {
    dispatch(trainsSlice.actions.setSelectedTrainIdx(props.idx));
  };
  return (
    <tr title={props.item.what?.join("\n") ?? ""} style={selectedMark}>
      <td style={statusMark} onClick={selectThis}>
        {props.item.name}
      </td>
      <td style={statusMark} onClick={selectThis}>
        {props.item.description}
      </td>
      <td>
        <button
          onClick={() =>
            dispatch(trainsSlice.actions.insertTrain(props.idx + 1))
          }
        >
          +
        </button>
        <button
          onClick={() => dispatch(trainsSlice.actions.removeTrain(props.idx))}
        >
          -
        </button>
      </td>
    </tr>
  );
};
