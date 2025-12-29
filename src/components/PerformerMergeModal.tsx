import { default as cx } from "classnames";
import StringInputRow from "./form/StringInputRow";
import {
  compareArrays,
  compareStashIDArrays,
  compareTagArrays,
  fetchData,
  modifyContentPerformers,
  validateArrayContainsOnlyUniques,
  validateDateString,
  validateNumString,
} from "../helpers";
import StringListInputRow from "./form/StringListInputRow";
import DropdownInputRow from "./form/DropdownInputRow";
import {
  circumcisedStrings,
  circumcisedToString,
  genderStrings,
  genderToString,
  getCountries,
  getCountryByISO,
  getISOByCountry,
  stringToCircumcised,
  stringToGender,
} from "../utils";
import TagSelectRow from "./form/TagSelectRow";
import ImageRow from "./form/ImageInputRow";
import CheckboxRow from "./form/CheckboxRow";
import StashIDListRow from "./form/StashIDsRow";
import React from "react";
import { Modal } from "react-bootstrap";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useIntl } from "react-intl";
import SharedCheckboxRow from "./form/SharedCheckboxRow";
import CustomFieldsRow from "./form/CustomFieldsRow";

const { PluginApi } = window;
const { Icon } = PluginApi.components;

const PerformerMergeModal: React.FC<PerformerMergeModalProps> = ({
  destinationPerformer,
  sourcePerformer,
  ...props
}) => {
  console.log("source performer:", sourcePerformer);
  console.log("destination performer:", destinationPerformer);

  // https://github.com/stashapp/stash/blob/develop/ui/v2.5/src/locales/en-GB.json
  const intl = useIntl();

  const heading = intl.formatMessage({
    id:
      props.mergeDirection === "from"
        ? "actions.merge_from"
        : "actions.merge_into",
  });

  // Only launch the modal if there is valid performer data for both sides.
  if (!sourcePerformer || !destinationPerformer) return null;

  const {
    alias_list,
    birthdate,
    career_length,
    circumcised,
    country,
    custom_fields,
    death_date,
    details,
    disambiguation,
    ethnicity,
    eye_color,
    gender,
    fake_tits,
    hair_color,
    height_cm,
    ignore_auto_tag,
    image_path,
    measurements,
    penis_length,
    piercings,
    stash_ids,
    tags,
    tattoos,
    weight,
  } = sourcePerformer;

  const urls = sourcePerformer.urls ?? [];

  /* -------------------------------------------- Name -------------------------------------------- */

  const [selectedName, setSelectedName] =
    React.useState<PerformerPosition>("source");

  /* --------------------------------------- Disambiguation --------------------------------------- */

  const [selectedDisambiguation, setSelectedDisambiguation] =
    React.useState<PerformerPosition>(
      disambiguation ? "source" : "destination"
    );

  const [pDisambiguation, setPDisambiguation] =
    React.useState<Performer["disambiguation"]>(disambiguation);

  /* ----------------------------------------- Alias list ----------------------------------------- */

  const [selectedAliasList, setSelectedAliasList] =
    React.useState<PerformerPosition>(
      alias_list.length ? "source" : "destination"
    );

  const [pAliasList, setPAliasList] =
    React.useState<Performer["alias_list"]>(alias_list);

  const aliasListIsRendered = !(
    alias_list.length === 0 ||
    compareArrays(destinationPerformer.alias_list, alias_list)
  );

  const [validAliasList, setValidAliasList] = React.useState(true);

  const validateAliasList = (arr: string[]) => {
    setValidAliasList(
      // Ignore validation if destination source is selected
      selectedAliasList === "destination" ||
        validateArrayContainsOnlyUniques(arr)
    );
  };

  // Ignore validation for alias list if changed back to destination performer.
  // useEffect required as the change isn't picked up after validateAliasList is
  // passed to the component.
  React.useEffect(() => {
    selectedAliasList === "destination"
      ? setValidAliasList(true)
      : validateAliasList(pAliasList);
  }, [selectedAliasList, pAliasList]);

  /* ----------------------------------- Add name to alias list ----------------------------------- */

  const addNameToAliasListDefaultValue = true;
  const [addNameToAliasList, setAddNameToAliasList] = React.useState(
    addNameToAliasListDefaultValue
  );

  const handleChangeAddNameToAliasList = () =>
    setAddNameToAliasList(!addNameToAliasList);

  // Render if names do not match. Don't depend on which name or alias list is
  // selected, to avoid complexity and changing the render state of the
  // component.
  const addNameToAliasListIsRendered =
    sourcePerformer.name !== destinationPerformer.name;

  const addNameToAliasListDescription =
    "If the unselected performer's name is not included in the selected performer's list of aliases, enable this checkbox to include it in the final list.";

  /* ------------------------------------------- Gender ------------------------------------------- */

  const [selectedGender, setSelectedGender] = React.useState<PerformerPosition>(
    gender ? "source" : "destination"
  );

  const [pGender, setPGender] = React.useState<Maybe<GenderEnum> | undefined>(
    gender
  );

  // Create an array of all options, including a blank option for undefined.
  const genderOptions = [""].concat(genderStrings);

  /** Handler for converting the dropdown string to a gender enum */
  const handleChangeGenderSelect = (v: string) => setPGender(stringToGender(v));

  /* ------------------------------------------ Birthdate ----------------------------------------- */

  const [selectedBirthdate, setSelectedBirthdate] =
    React.useState<PerformerPosition>(birthdate ? "source" : "destination");

  const [pBirthdate, setPBirthdate] =
    React.useState<Performer["birthdate"]>(birthdate);

  const [validBirthdate, setValidBirthdate] = React.useState(true);

  const validateBirthdate = (val: string) =>
    setValidDeathDate(
      // Ignore validation if destination source is selected
      selectedBirthdate === "destination" || validateDateString(val)
    );

  // Ignore validation for birthdate if changed back to destination performer.
  // useEffect required as the change isn't picked up after validateBirthdate is
  // passed to the component.
  React.useEffect(() => {
    selectedBirthdate === "destination"
      ? setValidBirthdate(true)
      : validateBirthdate(pBirthdate ?? "");
  }, [selectedBirthdate]);

  /* ----------------------------------------- Death date ----------------------------------------- */

  const [selectedDeathDate, setSelectedDeathDate] =
    React.useState<PerformerPosition>(death_date ? "source" : "destination");

  const [pDeathDate, setPDeathDate] =
    React.useState<Performer["death_date"]>(death_date);

  const [validDeathDate, setValidDeathDate] = React.useState(true);

  const validateDeathDate = (val: string) =>
    setValidDeathDate(
      // Ignore validation if destination source is selected
      selectedDeathDate === "destination" || validateDateString(val)
    );

  // Ignore validation for death date if changed back to destination performer.
  // useEffect required as the change isn't picked up after validateDeathDate is
  // passed to the component.
  React.useEffect(() => {
    selectedDeathDate === "destination"
      ? setValidDeathDate(true)
      : validateDeathDate(pDeathDate ?? "");
  }, [selectedDeathDate]);

  /* ------------------------------------------- Country ------------------------------------------ */

  const [selectedCountry, setSelectedCountry] =
    React.useState<PerformerPosition>(country ? "source" : "destination");

  // pCountry is the ISO code
  const [pCountry, setPCountry] = React.useState<Maybe<string> | undefined>(
    country
  );

  // Create an array of all options.
  const countryOptions = [""].concat(
    getCountries(intl.locale).map((c) => c.label + "")
  );

  /** Handler for converting the dropdown country name to a country ISO */
  const handleChangeCountrySelect = (v: string) => {
    setPCountry(!!v ? getISOByCountry(v, intl.locale) : "");
  };

  /* ------------------------------------------ Ethnicity ----------------------------------------- */

  const [selectedEthnicity, setSelectedEthnicity] =
    React.useState<PerformerPosition>(ethnicity ? "source" : "destination");

  const [pEthnicity, setPEthnicity] =
    React.useState<Performer["ethnicity"]>(ethnicity);

  /* ----------------------------------------- Hair color ----------------------------------------- */

  const [selectedHairColor, setSelectedHairColor] =
    React.useState<PerformerPosition>(hair_color ? "source" : "destination");

  const [pHairColor, setPHairColor] =
    React.useState<Performer["hair_color"]>(hair_color);

  /* ------------------------------------------ Eye color ----------------------------------------- */

  const [selectedEyeColor, setSelectedEyeColor] =
    React.useState<PerformerPosition>(eye_color ? "source" : "destination");

  const [pEyeColor, setPEyeColor] =
    React.useState<Performer["eye_color"]>(eye_color);

  /* ----------------------------------------- Height (cm) ---------------------------------------- */

  const [selectedHeightCm, setSelectedHeightCm] =
    React.useState<PerformerPosition>(height_cm ? "source" : "destination");

  const [pHeightCm, setPHeightCm] = React.useState<Maybe<string> | undefined>(
    height_cm?.toString()
  );

  const [validHeightCm, setValidHeightCm] = React.useState(true);

  const validateHeightCm = (val: string) =>
    setValidHeightCm(
      // Ignore validation if destination source is selected
      selectedHeightCm === "destination" || validateNumString(val, true)
    );

  // Ignore validation for height if changed back to destination performer.
  // useEffect required as the change isn't picked up after validateHeightCm is
  // passed to the component.
  React.useEffect(() => {
    selectedHeightCm === "destination"
      ? setValidHeightCm(true)
      : validateHeightCm(pHeightCm ?? "");
  }, [selectedHeightCm]);

  /* ------------------------------------------- Weight ------------------------------------------- */

  const [selectedWeight, setSelectedWeight] = React.useState<PerformerPosition>(
    weight ? "source" : "destination"
  );

  const [pWeight, setPWeight] = React.useState<Maybe<string> | undefined>(
    weight?.toString()
  );

  const [validWeight, setValidWeight] = React.useState(true);

  const validateWeight = (val: string) =>
    setValidWeight(
      // Ignore validation if destination source is selected
      selectedWeight === "destination" || validateNumString(val, true)
    );

  // Ignore validation for weight if changed back to destination performer.
  // useEffect required as the change isn't picked up after validateWeight is
  // passed to the component.
  React.useEffect(() => {
    selectedWeight === "destination"
      ? setValidWeight(true)
      : validateWeight(pWeight ?? "");
  }, [selectedWeight]);

  /* ---------------------------------------- Penis length ---------------------------------------- */

  const [selectedPenisLength, setSelectedPenisLength] =
    React.useState<PerformerPosition>(penis_length ? "source" : "destination");

  const [pPenisLength, setPPenisLength] = React.useState<
    Maybe<string> | undefined
  >(penis_length?.toString());

  const [validPenisLength, setValidPenisLength] = React.useState(true);

  const validatePenisLength = (val: string) =>
    setValidPenisLength(
      // Ignore validation if destination source is selected
      selectedPenisLength === "destination" || validateNumString(val, true)
    );

  // Ignore validation for penis length if changed back to destination
  // performer. useEffect required as the change isn't picked up after
  // validatePenisLength is passed to the component.
  React.useEffect(() => {
    selectedPenisLength === "destination"
      ? setValidPenisLength(true)
      : validatePenisLength(pPenisLength ?? "");
  }, [selectedPenisLength]);

  /* ----------------------------------------- Circumcised ---------------------------------------- */

  const [selectedCircumcised, setSelectedCircumcised] =
    React.useState<PerformerPosition>(circumcised ? "source" : "destination");

  const [pCircumcised, setPCircumcised] = React.useState<
    Maybe<CircumisedEnum> | undefined
  >(circumcised);

  // Create an array of all options, including a blank option for undefined.
  const circumcisedOptions = [""].concat(circumcisedStrings);

  /** Handler for converting the dropdown string to a circumcised enum */
  const handleChangeCircumcisedSelect = (v: string) =>
    setPCircumcised(stringToCircumcised(v));

  /* ---------------------------------------- Measurements ---------------------------------------- */

  const [selectedMeasurements, setSelectedMeasurements] =
    React.useState<PerformerPosition>(measurements ? "source" : "destination");

  const [pMeasurements, setPMeasurements] =
    React.useState<Performer["measurements"]>(measurements);

  /* ------------------------------------------ Fake tits ----------------------------------------- */

  const [selectedFakeTits, setSelectedFakeTits] =
    React.useState<PerformerPosition>(fake_tits ? "source" : "destination");

  const [pFakeTits, setPFakeTits] =
    React.useState<Performer["fake_tits"]>(fake_tits);

  /* ------------------------------------------- Tattoos ------------------------------------------ */

  const [selectedTattoos, setSelectedTattoos] =
    React.useState<PerformerPosition>(tattoos ? "source" : "destination");

  const [pTattoos, setPTattoos] = React.useState<Performer["tattoos"]>(tattoos);

  /* ------------------------------------------ Piercings ----------------------------------------- */

  const [selectedPiercings, setSelectedPiercings] =
    React.useState<PerformerPosition>(piercings ? "source" : "destination");

  const [pPiercings, setPPiercings] =
    React.useState<Performer["piercings"]>(piercings);

  /* ---------------------------------------- Career length --------------------------------------- */

  const [selectedCareerLength, setSelectedCareerLength] =
    React.useState<PerformerPosition>(career_length ? "source" : "destination");

  const [pCareerLength, setPCareerLength] =
    React.useState<Performer["career_length"]>(career_length);

  /* -------------------------------------------- URLs -------------------------------------------- */

  const [selectedURLs, setSelectedURLs] = React.useState<PerformerPosition>(
    urls.length ? "source" : "destination"
  );

  const [pURLs, setPURLs] = React.useState<string[]>(urls);

  const urlsIsRendered = !(
    urls.length === 0 || compareArrays(destinationPerformer.urls ?? [], urls)
  );

  const [validURLs, setValidURLs] = React.useState(true);

  const validateURLs = (arr: string[]) => {
    setValidURLs(
      // Ignore validation if destination source is selected
      selectedURLs === "destination" || validateArrayContainsOnlyUniques(arr)
    );
  };

  // Ignore validation for urls if changed back to destination performer.
  // useEffect required as the change isn't picked up after validateURLs is
  // passed to the component.
  React.useEffect(() => {
    selectedURLs === "destination" ? setValidURLs(true) : validateURLs(pURLs);
  }, [selectedURLs, pURLs]);

  /* ------------------------------------------- Details ------------------------------------------ */

  const [selectedDetails, setSelectedDetails] =
    React.useState<PerformerPosition>(details ? "source" : "destination");

  const [pDetails, setPDetails] = React.useState<Performer["details"]>(details);

  /* -------------------------------------------- Tags -------------------------------------------- */

  const [selectedTags, setSelectedTags] = React.useState<PerformerPosition>(
    tags ? "source" : "destination"
  );

  const [pTags, setPTags] = React.useState<Performer["tags"]>(tags);

  /* --------------------------------------- Performer image -------------------------------------- */

  const [selectedImagePath, setSelectedImagePath] =
    React.useState<PerformerPosition>(image_path ? "source" : "destination");

  const [pImagePath, setPImagePath] =
    React.useState<Performer["image_path"]>(image_path);

  /* --------------------------------------- Ignore auto-tag -------------------------------------- */

  const [selectedIgnoreAutoTag, setSelectedIgnoreAutoTag] =
    React.useState<PerformerPosition>(
      ignore_auto_tag ? "source" : "destination"
    );

  const [pIgnoreAutoTag, setPIgnoreAutoTag] =
    React.useState<Performer["ignore_auto_tag"]>(ignore_auto_tag);

  /* ------------------------------------------ Stash IDs ----------------------------------------- */

  const [selectedStashIDs, setSelectedStashIDs] =
    React.useState<PerformerPosition>(
      stash_ids.length ? "source" : "destination"
    );

  const [pStashIDs, setPStashIDs] =
    React.useState<Performer["stash_ids"]>(stash_ids);

  /* ---------------------------------------- Custom fields --------------------------------------- */

  // Custom fields are different to others as they can contain a mix of selected
  // positions. Before setting the initial states, both destination and source
  // objects need to be converted to arrays and compared so that fields with
  // matching keys are linked.
  const destinationCustomFieldsValues: CustomFieldValue[] = [];
  const sourceCustomFieldsValues: CustomFieldValue[] = [];

  // Create a list of unique custom field property keys
  const destinationCustomFieldKeys = Object.keys(
    destinationPerformer.custom_fields
  );
  const sourceCustomFieldKeys = Object.keys(custom_fields);
  const customFieldLabels: string[] = [
    ...new Set([...destinationCustomFieldKeys, ...sourceCustomFieldKeys]),
  ];

  // Loop through each custom field label and apply the value for destination
  // and source performer values to their respective arrays.
  for (let i = 0; i < customFieldLabels.length; i++) {
    const key = customFieldLabels[i];

    // Destination performer
    destinationCustomFieldsValues.push(
      destinationCustomFieldKeys.includes(key)
        ? destinationPerformer.custom_fields[key]
        : undefined
    );

    // Source performer
    sourceCustomFieldsValues.push(
      sourceCustomFieldKeys.includes(key) ? custom_fields[key] : undefined
    );
  }

  // The selected position of each field. Default to "destination" unless it is
  // undefined.
  const [selectedCustomFields, setSelectedCustomFields] = React.useState<
    PerformerPosition[]
  >(
    destinationCustomFieldsValues.map((v) =>
      v === undefined ? "source" : "destination"
    )
  );

  // The value of each source custom field.
  const [sourceCustomFields, setSourceCustomFields] = React.useState<
    CustomFieldValue[]
  >(sourceCustomFieldsValues);

  // Which fields have been marked for removal.
  const [fieldsToRemove, setFieldsToRemove] = React.useState(
    destinationCustomFieldsValues.map(() => false)
  );

  /* ------------------------------------------- General ------------------------------------------ */

  /** Resets all fields to their original state. */
  const resetAllFields = () => {
    // Reset source values
    setPDisambiguation(disambiguation);
    setPAliasList(alias_list);
    setPGender(gender);
    setPBirthdate(birthdate);
    setPDeathDate(death_date);
    setPCountry(country);
    setPEthnicity(ethnicity);
    setPHairColor(hair_color);
    setPEyeColor(eye_color);
    setPHeightCm(height_cm?.toString());
    setPWeight(weight?.toString());
    setPPenisLength(penis_length?.toString());
    setPCircumcised(circumcised);
    setPMeasurements(measurements);
    setPFakeTits(fake_tits);
    setPTattoos(tattoos);
    setPPiercings(piercings);
    setPCareerLength(career_length);
    setPURLs(urls);
    setPDetails(details);
    setPTags(tags);
    setPImagePath(image_path);
    setPIgnoreAutoTag(ignore_auto_tag);
    setPStashIDs(stash_ids);
    setSourceCustomFields(sourceCustomFieldsValues);

    // Reset selected position
    setSelectedName("source");
    setSelectedDisambiguation(disambiguation ? "source" : "destination");
    setSelectedAliasList(alias_list.length ? "source" : "destination");
    setSelectedGender(gender ? "source" : "destination");
    setSelectedBirthdate(birthdate ? "source" : "destination");
    setSelectedDeathDate(death_date ? "source" : "destination");
    setSelectedCountry(country ? "source" : "destination");
    setSelectedEthnicity(ethnicity ? "source" : "destination");
    setSelectedHairColor(hair_color ? "source" : "destination");
    setSelectedEyeColor(eye_color ? "source" : "destination");
    setSelectedHeightCm(height_cm ? "source" : "destination");
    setSelectedWeight(weight ? "source" : "destination");
    setSelectedPenisLength(penis_length ? "source" : "destination");
    setSelectedCircumcised(circumcised ? "source" : "destination");
    setSelectedMeasurements(measurements ? "source" : "destination");
    setSelectedFakeTits(fake_tits ? "source" : "destination");
    setSelectedTattoos(tattoos ? "source" : "destination");
    setSelectedPiercings(piercings ? "source" : "destination");
    setSelectedCareerLength(career_length ? "source" : "destination");
    setSelectedURLs(urls.length ? "source" : "destination");
    setSelectedDetails(details ? "source" : "destination");
    setSelectedTags(tags ? "source" : "destination");
    setSelectedImagePath(image_path ? "source" : "destination");
    setSelectedIgnoreAutoTag(ignore_auto_tag ? "source" : "destination");
    setSelectedStashIDs(stash_ids.length ? "source" : "destination");
    setSelectedCustomFields(
      destinationCustomFieldsValues.map((v) =>
        v === undefined ? "source" : "destination"
      )
    );

    // Reset remaining
    setAddNameToAliasList(addNameToAliasListDefaultValue);
    setFieldsToRemove(destinationCustomFieldsValues.map(() => false));
  };

  // Updates on source performer change
  React.useEffect(() => resetAllFields(), [sourcePerformer]);

  // Enable confirm button if all fields with validation pass.
  const canSubmit =
    validAliasList &&
    validBirthdate &&
    validDeathDate &&
    validHeightCm &&
    validWeight &&
    validPenisLength &&
    validURLs;

  /* -------------------------------------------- Modal ------------------------------------------- */

  /** Handler for clicking the cancel button. */
  const handleCancel = () => {
    props.setShow(false);

    // Clear any changes made by the user
    resetAllFields();
  };

  const dialogClasses = cx("modal-dialog", "scrape-dialog", "modal-lg");

  /** Handler for clicking the confirm button. */
  const handleConfirm = () => {
    // Process alias list
    const processedAliasList =
      selectedAliasList === "source"
        ? pAliasList.filter((v) => v !== "") // Filter out empty inputs
        : destinationPerformer.alias_list;

    // Get the unselected performer name
    const unselectedName =
      selectedName === "source"
        ? destinationPerformer.name
        : sourcePerformer.name;

    // Add the unselected name to the alias list if the user has enabled it and
    // it isn't already included in the list
    if (addNameToAliasList && !processedAliasList.includes(unselectedName))
      processedAliasList.push(unselectedName);

    // Create the new custom fields object
    const mappedCustomFields: {
      [key: string]: CustomFieldValue;
    } = {};

    for (let i = 0; i < customFieldLabels.length; i++) {
      const key = customFieldLabels[i];

      // Only add if the field is not marked for removal
      if (!fieldsToRemove[i]) {
        const value =
          selectedCustomFields[i] === "source"
            ? sourceCustomFields[i]
            : destinationCustomFieldsValues[i];

        // Add the property to the custom fields object unless it is undefined.
        if (typeof value !== "undefined") mappedCustomFields[key] = value;
      }
    }

    const customFieldsInput: CustomFieldsInput = {
      full: mappedCustomFields,
    };

    // Get the updated data
    const updatedData: PerformerUpdateInput = {
      id: destinationPerformer.id,
      name:
        selectedName === "source"
          ? sourcePerformer.name
          : destinationPerformer.name,
      alias_list: processedAliasList,
      birthdate:
        selectedBirthdate === "source"
          ? !!pBirthdate
            ? new Date(pBirthdate).toISOString().split("T")[0]
            : ""
          : destinationPerformer.birthdate,
      career_length:
        selectedCareerLength === "source"
          ? pCareerLength
          : destinationPerformer.career_length,
      circumcised:
        selectedCircumcised === "source"
          ? pCircumcised
          : destinationPerformer.circumcised,
      country:
        selectedCountry === "source" ? pCountry : destinationPerformer.country,
      custom_fields: customFieldsInput,
      death_date:
        selectedDeathDate === "source"
          ? !!pDeathDate
            ? new Date(pDeathDate).toISOString().split("T")[0]
            : ""
          : destinationPerformer.death_date,
      details:
        selectedDetails === "source" ? pDetails : destinationPerformer.details,
      disambiguation:
        selectedDisambiguation === "source"
          ? pDisambiguation
          : destinationPerformer.disambiguation,
      ethnicity:
        selectedEthnicity === "source"
          ? pEthnicity
          : destinationPerformer.ethnicity,
      eye_color:
        selectedEyeColor === "source"
          ? pEyeColor
          : destinationPerformer.eye_color,
      fake_tits:
        selectedFakeTits === "source"
          ? pFakeTits
          : destinationPerformer.fake_tits,
      gender:
        selectedGender === "source" ? pGender : destinationPerformer.gender,
      hair_color:
        selectedHairColor === "source"
          ? pHairColor
          : destinationPerformer.hair_color,
      height_cm:
        selectedHeightCm === "source"
          ? !!pHeightCm
            ? +pHeightCm
            : undefined
          : destinationPerformer.height_cm,
      ignore_auto_tag:
        selectedIgnoreAutoTag === "source"
          ? pIgnoreAutoTag
          : destinationPerformer.ignore_auto_tag,
      image:
        selectedImagePath === "source"
          ? pImagePath
          : destinationPerformer.image_path,
      measurements:
        selectedMeasurements === "source"
          ? pMeasurements
          : destinationPerformer.measurements,
      penis_length:
        selectedPenisLength === "source"
          ? !!pPenisLength
            ? +pPenisLength
            : undefined
          : destinationPerformer.penis_length,
      piercings:
        selectedPiercings === "source"
          ? pPiercings
          : destinationPerformer.piercings,
      stash_ids:
        selectedStashIDs === "source"
          ? pStashIDs
          : destinationPerformer.stash_ids,
      tag_ids:
        selectedTags === "source"
          ? pTags.map((t) => t.id)
          : destinationPerformer.tags.map((t) => t.id),
      tattoos:
        selectedTattoos === "source" ? pTattoos : destinationPerformer.tattoos,
      weight:
        selectedWeight === "source"
          ? pWeight
            ? +pWeight
            : undefined
          : destinationPerformer.weight,
      urls:
        selectedURLs === "source"
          ? pURLs.filter((v) => v !== "") // Filter out empty inputs
          : destinationPerformer.urls,
    };

    // Add destination performer ID to source performer scenes
    const sceneIDs = sourcePerformer.scenes.map((s) => s.id);

    modifyContentPerformers({
      content: "Scene",
      contentIDs: sceneIDs,
      mode: "ADD",
      performerID: destinationPerformer.id,
    });

    // Add destination performer ID to source performer galleries
    const sourceGalleriesQuery = `query SourcePerformerGalleries($input: GalleryFilterType) {
      findGalleries(filter: {per_page: -1}, gallery_filter: $input) {
        galleries {
          id
        }
      }
    }`;

    const sourceGalleriesInput = {
      input: {
        performers: {
          value: [sourcePerformer.id],
          modifier: "INCLUDES",
        },
      },
    };

    fetchData<{
      data: { findGalleries: FindGalleriesResultType };
    }>(sourceGalleriesQuery, sourceGalleriesInput).then((res) => {
      const galleryIDs =
        res?.data.findGalleries.galleries.map((g) => g.id) ?? [];
      modifyContentPerformers({
        content: "Gallery",
        contentIDs: galleryIDs,
        mode: "ADD",
        performerID: destinationPerformer.id,
      });
    });

    // Add destination performer ID to source performer images
    const sourceImagesQuery = `query SourcePerformerImages($input: ImageFilterType) {
      findImages(filter: {per_page: -1}, image_filter: $input) {
        images {
          id
        }
      }
    }`;

    const sourceImagesInput = {
      input: {
        performers: {
          value: [sourcePerformer.id],
          modifier: "INCLUDES",
        },
      },
    };

    fetchData<{
      data: { findImages: FindImagesResultType };
    }>(sourceImagesQuery, sourceImagesInput).then((res) => {
      const imageIDs = res?.data.findImages.images.map((i) => i.id) ?? [];
      modifyContentPerformers({
        content: "Image",
        contentIDs: imageIDs,
        mode: "ADD",
        performerID: destinationPerformer.id,
      });
    });

    // Delete the source performer from the database
    const deleteSourceQuery = `mutation DeleteSourcePerformer($input: PerformerDestroyInput!) { performerDestroy(input: $input) }`;
    const deleteSourceInput = { input: { id: sourcePerformer.id } };
    fetchData(deleteSourceQuery, deleteSourceInput).then((res) =>
      console.log("source deleted", res)
    );

    // Update the destination performer data
    const updateDestination = `mutation UpdateDestinationPerformer ($input: PerformerUpdateInput!) { performerUpdate(input: $input) { id } }`;
    fetchData(updateDestination, { input: updatedData })
      // Load the destination performer's page. Do this even if we're already on
      // it so that data is refreshed
      .then(() =>
        // Set timeout just so the modal has time to close.
        setTimeout(() => {
          window.location.href = `/performers/${destinationPerformer.id}/`;
        }, 500)
      );

    // Close the modal
    props.setShow(false);
  };

  /* ------------------------------------------ Component ----------------------------------------- */

  return (
    <Modal
      className="merge-performers-merge-modal"
      dialogClassName={dialogClasses}
      show={props.show}
    >
      <Modal.Header>
        <Icon icon={faPencil} />
        <span>{heading}</span>
      </Modal.Header>
      <Modal.Body>
        <div className="dialog-container">
          <form>
            <div className="px-3 pt-3 row">
              <div className="col-lg-9 offset-lg-3">
                <div className="row">
                  <label className="form-label col-form-label col-6">
                    {intl.formatMessage({ id: "dialogs.merge.destination" })}
                  </label>
                  <label className="form-label col-form-label col-6">
                    {intl.formatMessage({ id: "dialogs.merge.source" })}
                  </label>
                </div>
              </div>
            </div>
            <StringInputRow
              destinationValue={destinationPerformer.name}
              label={intl.formatMessage({ id: "name" })}
              placeholder={intl.formatMessage({ id: "name" })}
              selectedInput={selectedName}
              setSelectedInput={setSelectedName}
              sourceValue={sourcePerformer.name}
            />
            <StringInputRow
              destinationValue={destinationPerformer.disambiguation ?? ""}
              label={intl.formatMessage({ id: "disambiguation" })}
              placeholder={intl.formatMessage({ id: "disambiguation" })}
              render={disambiguation !== destinationPerformer.disambiguation}
              selectedInput={selectedDisambiguation}
              setSelectedInput={setSelectedDisambiguation}
              setSourceValue={setPDisambiguation}
              sourceValue={pDisambiguation ?? ""}
            />
            <StringListInputRow
              destinationValue={destinationPerformer.alias_list}
              label={intl.formatMessage({ id: "aliases" })}
              placeholder={intl.formatMessage({ id: "aliases" })}
              render={aliasListIsRendered}
              selectedInput={selectedAliasList}
              setSelectedInput={setSelectedAliasList}
              setSourceValue={setPAliasList}
              sourceValue={pAliasList}
            />
            <SharedCheckboxRow
              description={addNameToAliasListDescription}
              label="Add name as alias"
              render={addNameToAliasListIsRendered}
              setValue={handleChangeAddNameToAliasList}
              value={addNameToAliasList}
            />
            <DropdownInputRow
              destinationValue={
                genderToString(destinationPerformer.gender) ?? ""
              }
              label={intl.formatMessage({ id: "gender" })}
              options={genderOptions}
              render={
                !!gender &&
                genderToString(gender) !==
                  genderToString(destinationPerformer.gender)
              }
              selectedInput={selectedGender}
              setSelectedInput={setSelectedGender}
              setSourceValue={handleChangeGenderSelect}
              sourceValue={genderToString(pGender) ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.birthdate ?? ""}
              label={intl.formatMessage({ id: "birthdate" })}
              placeholder={intl.formatMessage({ id: "date_format" })}
              render={
                !!birthdate && birthdate !== destinationPerformer.birthdate
              }
              selectedInput={selectedBirthdate}
              setSelectedInput={setSelectedBirthdate}
              setSourceValue={setPBirthdate}
              sourceValue={pBirthdate ?? ""}
              validation={validateBirthdate}
            />
            <StringInputRow
              destinationValue={destinationPerformer.death_date ?? ""}
              label={intl.formatMessage({ id: "death_date" })}
              placeholder={intl.formatMessage({ id: "date_format" })}
              render={
                !!death_date && death_date !== destinationPerformer.death_date
              }
              selectedInput={selectedDeathDate}
              setSelectedInput={setSelectedDeathDate}
              setSourceValue={setPDeathDate}
              sourceValue={pDeathDate ?? ""}
              validation={validateDeathDate}
            />
            <DropdownInputRow
              destinationValue={
                !!destinationPerformer.country
                  ? getCountryByISO(destinationPerformer.country) ?? ""
                  : ""
              }
              label={intl.formatMessage({ id: "country" })}
              options={countryOptions}
              render={!!country && country !== destinationPerformer.country}
              selectedInput={selectedCountry}
              setSelectedInput={setSelectedCountry}
              setSourceValue={handleChangeCountrySelect}
              sourceValue={!!pCountry ? getCountryByISO(pCountry) ?? "" : ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.ethnicity ?? ""}
              label={intl.formatMessage({ id: "ethnicity" })}
              placeholder={intl.formatMessage({ id: "ethnicity" })}
              render={
                !!ethnicity && ethnicity !== destinationPerformer.ethnicity
              }
              selectedInput={selectedEthnicity}
              setSelectedInput={setSelectedEthnicity}
              setSourceValue={setPEthnicity}
              sourceValue={pEthnicity ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.hair_color ?? ""}
              label={intl.formatMessage({ id: "hair_color" })}
              placeholder={intl.formatMessage({ id: "hair_color" })}
              render={
                !!hair_color && hair_color !== destinationPerformer.hair_color
              }
              selectedInput={selectedHairColor}
              setSelectedInput={setSelectedHairColor}
              setSourceValue={setPHairColor}
              sourceValue={pHairColor ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.eye_color ?? ""}
              label={intl.formatMessage({ id: "eye_color" })}
              placeholder={intl.formatMessage({ id: "eye_color" })}
              render={
                !!eye_color && eye_color !== destinationPerformer.eye_color
              }
              selectedInput={selectedEyeColor}
              setSelectedInput={setSelectedEyeColor}
              setSourceValue={setPEyeColor}
              sourceValue={pEyeColor ?? ""}
            />
            <StringInputRow
              destinationValue={
                destinationPerformer.height_cm?.toString() ?? ""
              }
              label={intl.formatMessage({ id: "height_cm" })}
              placeholder={intl.formatMessage({ id: "height_cm" })}
              render={
                !!height_cm && height_cm !== destinationPerformer.height_cm
              }
              selectedInput={selectedHeightCm}
              setSelectedInput={setSelectedHeightCm}
              setSourceValue={setPHeightCm}
              sourceValue={pHeightCm ?? ""}
              validation={validateHeightCm}
            />
            <StringInputRow
              destinationValue={destinationPerformer.weight?.toString() ?? ""}
              label={intl.formatMessage({ id: "weight" })}
              placeholder={intl.formatMessage({ id: "weight" })}
              render={!!weight && weight !== destinationPerformer.weight}
              selectedInput={selectedWeight}
              setSelectedInput={setSelectedWeight}
              setSourceValue={setPWeight}
              sourceValue={pWeight ?? ""}
              validation={validateWeight}
            />
            <StringInputRow
              destinationValue={
                destinationPerformer.penis_length?.toString() ?? ""
              }
              label={intl.formatMessage({ id: "penis_length" })}
              placeholder={intl.formatMessage({ id: "penis_length" })}
              render={
                !!penis_length &&
                penis_length !== destinationPerformer.penis_length
              }
              selectedInput={selectedPenisLength}
              setSelectedInput={setSelectedPenisLength}
              setSourceValue={setPPenisLength}
              sourceValue={pPenisLength ?? ""}
              validation={validatePenisLength}
            />
            <DropdownInputRow
              destinationValue={
                circumcisedToString(destinationPerformer.circumcised) ?? ""
              }
              label={intl.formatMessage({ id: "circumcised" })}
              options={circumcisedOptions}
              render={
                !!circumcised &&
                circumcisedToString(circumcised) !==
                  circumcisedToString(destinationPerformer.circumcised)
              }
              selectedInput={selectedCircumcised}
              setSelectedInput={setSelectedCircumcised}
              setSourceValue={handleChangeCircumcisedSelect}
              sourceValue={circumcisedToString(pCircumcised) ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.measurements ?? ""}
              label={intl.formatMessage({ id: "measurements" })}
              placeholder={intl.formatMessage({ id: "measurements" })}
              render={
                !!measurements &&
                measurements !== destinationPerformer.measurements
              }
              selectedInput={selectedMeasurements}
              setSelectedInput={setSelectedMeasurements}
              setSourceValue={setPMeasurements}
              sourceValue={pMeasurements ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.fake_tits ?? ""}
              label={intl.formatMessage({ id: "fake_tits" })}
              placeholder={intl.formatMessage({ id: "fake_tits" })}
              render={
                !!fake_tits && fake_tits !== destinationPerformer.fake_tits
              }
              selectedInput={selectedFakeTits}
              setSelectedInput={setSelectedFakeTits}
              setSourceValue={setPFakeTits}
              sourceValue={pFakeTits ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.tattoos ?? ""}
              isTextArea
              label={intl.formatMessage({ id: "tattoos" })}
              placeholder={intl.formatMessage({ id: "tattoos" })}
              render={!!tattoos && tattoos !== destinationPerformer.tattoos}
              selectedInput={selectedTattoos}
              setSelectedInput={setSelectedTattoos}
              setSourceValue={setPTattoos}
              sourceValue={pTattoos ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.piercings ?? ""}
              isTextArea
              label={intl.formatMessage({ id: "piercings" })}
              placeholder={intl.formatMessage({ id: "piercings" })}
              render={
                !!piercings && piercings !== destinationPerformer.piercings
              }
              selectedInput={selectedPiercings}
              setSelectedInput={setSelectedPiercings}
              setSourceValue={setPPiercings}
              sourceValue={pPiercings ?? ""}
            />
            <StringInputRow
              destinationValue={destinationPerformer.career_length ?? ""}
              label={intl.formatMessage({ id: "career_length" })}
              placeholder={intl.formatMessage({ id: "career_length" })}
              render={
                !!career_length &&
                career_length !== destinationPerformer.career_length
              }
              selectedInput={selectedCareerLength}
              setSelectedInput={setSelectedCareerLength}
              setSourceValue={setPCareerLength}
              sourceValue={pCareerLength ?? ""}
            />
            <StringListInputRow
              destinationValue={destinationPerformer.urls ?? []}
              label={intl.formatMessage({ id: "urls" })}
              placeholder={intl.formatMessage({ id: "urls" })}
              render={urlsIsRendered}
              selectedInput={selectedURLs}
              setSelectedInput={setSelectedURLs}
              setSourceValue={setPURLs}
              sourceValue={pURLs}
            />
            <StringInputRow
              destinationValue={destinationPerformer.details ?? ""}
              isTextArea
              label={intl.formatMessage({ id: "details" })}
              placeholder={intl.formatMessage({ id: "details" })}
              render={!!details && details !== destinationPerformer.details}
              selectedInput={selectedDetails}
              setSelectedInput={setSelectedDetails}
              setSourceValue={setPDetails}
              sourceValue={pDetails ?? ""}
            />
            <TagSelectRow
              destinationValue={destinationPerformer.tags}
              label={intl.formatMessage({ id: "tags" })}
              render={
                !!tags.length &&
                !compareTagArrays(tags, destinationPerformer.tags)
              }
              selectedInput={selectedTags}
              setSelectedInput={setSelectedTags}
              setSourceValue={setPTags}
              sourceValue={pTags}
            />
            <ImageRow
              destinationImage={{
                alt: intl.formatMessage({ id: "performer_image" }),
                src: destinationPerformer.image_path ?? "",
              }}
              label={intl.formatMessage({ id: "performer_image" })}
              render={
                !!image_path && image_path !== destinationPerformer.image_path
              }
              selectedInput={selectedImagePath}
              setSelectedInput={setSelectedImagePath}
              sourceImage={{
                alt: intl.formatMessage({ id: "performer_image" }),
                src: pImagePath ?? "",
              }}
            />
            <CheckboxRow
              destinationValue={destinationPerformer.ignore_auto_tag}
              label={intl.formatMessage({ id: "ignore_auto_tag" })}
              render={ignore_auto_tag !== destinationPerformer.ignore_auto_tag}
              selectedInput={selectedIgnoreAutoTag}
              setSelectedInput={setSelectedIgnoreAutoTag}
              setSourceValue={setPIgnoreAutoTag}
              sourceValue={pIgnoreAutoTag}
            />
            <StashIDListRow
              destinationIDs={destinationPerformer.stash_ids}
              label={intl.formatMessage({ id: "stash_ids" })}
              render={
                !!stash_ids.length &&
                !compareStashIDArrays(stash_ids, destinationPerformer.stash_ids)
              }
              selectedInput={selectedStashIDs}
              setSelectedInput={setSelectedStashIDs}
              setSourceValue={setPStashIDs}
              sourceIDs={pStashIDs}
              stashBoxes={props.stashBoxes}
            />
            <CustomFieldsRow
              destinationValues={destinationCustomFieldsValues}
              fieldsToRemove={fieldsToRemove}
              labels={customFieldLabels}
              selectedInputs={selectedCustomFields}
              setFieldsToRemove={setFieldsToRemove}
              setSelectedInputs={setSelectedCustomFields}
              setSourceValues={setSourceCustomFields}
              sourceValues={sourceCustomFields}
            />
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div style={{ marginLeft: "auto" }}>
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            type="button"
          >
            {intl.formatMessage({ id: "actions.cancel" })}
          </button>
          <button
            className="ml-2 btn btn-secondary"
            onClick={resetAllFields}
            type="button"
          >
            {intl.formatMessage({ id: "actions.refresh" })}
          </button>
          <button
            className="ml-2 btn btn-primary"
            disabled={!canSubmit}
            onClick={handleConfirm}
            type="button"
          >
            {intl.formatMessage({ id: "actions.confirm" })}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PerformerMergeModal;

interface PerformerMergeModalProps {
  /** Current data for the destination performer */
  destinationPerformer?: Performer;

  /** The type of modal this is. */
  mergeDirection: MergeDirection;

  /** Whether to display the modal. */
  show: boolean;

  /** Set whether to display the modal. */
  setShow: React.Dispatch<React.SetStateAction<boolean>>;

  /** Current data for the source performer */
  sourcePerformer?: Performer;

  /** Data for each Stash box */
  stashBoxes: StashBox[];
}
