import React from "react";
import MergeDropdownButton from "./components/MergeDropdownButton";
import PerformerMergeModal from "./components/PerformerMergeModal";
import SearchModal from "./components/SearchModal";
import { mergeButtonRootID } from "./constants";
import { fetchData, fetchPerformerData } from "./helpers";
import "./styles.scss";
import ReactDOM from "react-dom";
import { useIntl } from "react-intl";

const { PluginApi } = window;

// Wait for the performer details panel to load, as this contains the
PluginApi.patch.instead("PerformerDetailsPanel", function (props, _, Original) {
  // https://github.com/stashapp/stash/blob/develop/ui/v2.5/src/locales/en-GB.json
  const intl = useIntl();

  /* ----------------------------------------- Fetch data ----------------------------------------- */

  const [stashboxes, setStashboxes] = React.useState<StashBox[]>([]);
  const [thisPerformer, setThisPerformer] = React.useState<
    Performer | undefined
  >(undefined);

  const query = `query { configuration { general { stashBoxes { endpoint name } } } }`;

  React.useEffect(() => {
    // Fetch Stashbox config data
    fetchData<{ data: { configuration: ConfigResult } }>(query).then((res) => {
      console.log(res);
      if (res?.data) setStashboxes(res.data.configuration.general.stashBoxes);
    });

    // Fetch data for the peformer whose page we're on.
    fetchPerformerData(props.performer.id).then((res) => setThisPerformer(res));
  }, []);

  /* ---------------------------------------- Search modal ---------------------------------------- */

  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [mergeDirection, setMergeDirection] =
    React.useState<MergeDirection>("from");
  const [selectedPerformer, setSelectedPerformer] = React.useState<
    Performer | undefined
  >();

  /** Handler for clicking the "Merge from..." button. */
  const handleMergeFromClick: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    setMergeDirection("from");
    setShowSearchModal(true);
  };

  /** Handler for clicking the "Merge into..." button. */
  const handleMergeIntoClick: React.MouseEventHandler<
    HTMLAnchorElement
  > = () => {
    setMergeDirection("into");
    setShowSearchModal(true);
  };

  /* ----------------------------------------- Merge modal ---------------------------------------- */

  const [showMergeModal, setShowMergeModal] = React.useState(false);

  const destinationPerformer =
    mergeDirection === "into" ? selectedPerformer : thisPerformer;

  const sourcePerformer =
    mergeDirection === "from" ? selectedPerformer : thisPerformer;

  /* ------------------------------------ Merge dropdown button ----------------------------------- */

  // Find .details-edit which contains the editing buttons under the performer
  // details.
  const elDetailsEdit = document.querySelector(".details-edit");
  const elDeleteButton = elDetailsEdit?.querySelector("button.delete");

  // Check if the merge button has already rendered to avoid re-rendering on
  // scroll.
  const mergeBtnExists =
    document.querySelector("#" + mergeButtonRootID) !== null;

  if (elDetailsEdit && !mergeBtnExists) {
    // Create the root for the buttons
    const elButtonRoot = document.createElement("div");
    elButtonRoot.setAttribute("id", mergeButtonRootID);

    // If the delete button has been found, set the button root before it.
    // Otherwise, add it to the end of the .details-edit container.
    elDeleteButton
      ? elDeleteButton.before(elButtonRoot)
      : elDetailsEdit.append(elButtonRoot);

    // Deprecated in React but still available via the Plugin API at time of
    // development.
    ReactDOM.render(
      <MergeDropdownButton
        intl={intl}
        mergeFromClickHandler={handleMergeFromClick}
        mergeIntoClickHandler={handleMergeIntoClick}
      />,
      elButtonRoot
    );
  }

  /* ------------------------------------------ Component ----------------------------------------- */

  if (!thisPerformer) return [<Original {...props} />];

  return [
    <>
      <Original {...props} />
      <SearchModal
        mergeDirection={mergeDirection}
        selected={selectedPerformer}
        setSelected={setSelectedPerformer}
        setShow={setShowSearchModal}
        setShowMergeModal={setShowMergeModal}
        show={showSearchModal}
        thisObject={thisPerformer}
        type="performer"
      />
      <PerformerMergeModal
        destinationPerformer={destinationPerformer}
        mergeDirection={mergeDirection}
        setShow={setShowMergeModal}
        show={showMergeModal}
        sourcePerformer={sourcePerformer}
        stashBoxes={stashboxes}
      />
    </>,
  ];
});
