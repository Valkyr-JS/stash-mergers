import React from "react";
import { Modal } from "react-bootstrap";
import {
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useIntl } from "react-intl";
import { fetchPerformerData } from "../helpers";
import Feedback from "./Feedback";
import { IFilterProps, IFilterValueProps } from "@/pluginTypes/stashPlugin";

const { PluginApi } = window;
const { Icon } = PluginApi.components;

const SearchModal: React.FC<
  PerformerSearchModalProps | StudioSearchModalProps
> = (props) => {
  // https://github.com/stashapp/stash/blob/develop/ui/v2.5/src/locales/en-GB.json
  const intl = useIntl();

  const heading = intl.formatMessage({
    id:
      props.mergeDirection === "from"
        ? "actions.merge_from"
        : "actions.merge_into",
  });

  /* -------------------------------------------- Modal ------------------------------------------- */

  /** Handler for closing the modal. */
  const handleCloseModal = () => {
    props.setShow(false);
    props.setSelected(undefined);
  };

  /** Handler for clicking the confirm button. */
  const handleConfirmButtonClick = () => {
    props.setShow(false);
    props.setShowMergeModal(true);
  };

  const modalIcon =
    props.mergeDirection === "from" ? faRightToBracket : faRightFromBracket;

  const searchObjectType = intl.formatMessage({
    id:
      props.mergeDirection === "from"
        ? "dialogs.merge.source"
        : "dialogs.merge.destination",
  });

  /* -------------------------------------- Object selection -------------------------------------- */

  const [showWarning, setShowWarning] = React.useState(false);

  // Wait for PluginApi components to load before rendering.
  const componentsLoading = PluginApi.hooks.useLoadComponents([
    PluginApi.loadableComponents.PerformerSelect,
  ]);

  if (componentsLoading) return null;

  let Selector = <></>;

  switch (props.type) {
    case "performer":
      const { PerformerSelect } = PluginApi.components;

      /** Handler for selecting a performer in the selection list */
      const handlePerformerSelect = (performers: Performer[]) => {
        if (performers.length) {
          const selection = performers[0];

          fetchPerformerData(selection.id).then((res) =>
            props.setSelected(res)
          );

          // Check the selected performer isn't the current performer, and warn if
          // it is.
          setShowWarning(selection.id === props.thisObject.id);
        }
      };

      Selector = (
        <PerformerSelect
          active={!!props.selected?.id}
          creatable={false}
          isClearable={false}
          onSelect={handlePerformerSelect}
          values={props.selected ? [props.selected] : []}
        />
      );
  }

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <Modal className="merge-performers-search-modal" show={props.show}>
      <Modal.Header>
        <Icon icon={modalIcon} />
        <span>{heading}</span>
      </Modal.Header>
      <Modal.Body>
        <div className="form-container row px-3">
          <div className="col-12 col-lg-6 col-xl-12">
            <div className="form-group row">
              <label
                htmlFor={searchObjectType.toLowerCase()}
                className="form-label col-form-label col-xl-12 col-sm-3"
              >
                {searchObjectType}
              </label>
              <div className="col-xl-12 col-sm-9">
                {props.type === "performer" ? Selector : null}
                <Feedback show={showWarning} type="error">
                  Source and destination {props.type}s cannot match.
                </Feedback>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ marginLeft: "auto" }}>
          <button
            className="btn btn-secondary"
            onClick={handleCloseModal}
            type="button"
          >
            {intl.formatMessage({ id: "actions.cancel" })}
          </button>
          <button
            className="ml-2 btn btn-primary"
            disabled={!props.selected || showWarning}
            onClick={handleConfirmButtonClick}
            type="button"
          >
            {intl.formatMessage({ id: "actions.confirm" })}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;

interface SearchModalProps {
  /** The type of modal this is. */
  mergeDirection: MergeDirection;

  /** Set whether to display the modal. */
  setShow: React.Dispatch<React.SetStateAction<boolean>>;

  /** Set whether to display the merge modal. */
  setShowMergeModal: React.Dispatch<React.SetStateAction<boolean>>;

  /** Whether to display the modal. */
  show: boolean;
}

interface PerformerSearchModalProps extends SearchModalProps {
  type: "performer";

  selected: Performer | undefined;

  setSelected: React.Dispatch<React.SetStateAction<Performer | undefined>>;

  /** Data for the object whose profile page is currently open. */
  thisObject: Performer;
}
interface StudioSearchModalProps extends SearchModalProps {
  type: "studio";

  selected: Studio | undefined;

  setSelected: React.Dispatch<React.SetStateAction<Studio | undefined>>;

  /** Data for the object whose profile page is currently open. */
  thisObject: Studio;
}
