import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import { CheckboxGroupHeading } from "react-multiselect-checkboxes/lib/CheckboxGroup.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateRangePicker from "rsuite/DateRangePicker";
import makeAnimated from "react-select/animated";
import isEmpty from "validator/lib/isEmpty";
import "../style/Popup.css";
import "../style/DatePicker.css";
import "../style/CreateVoucher.css";
import {
  listVoucherTypeController,
  listServiceApplicationController,
  listDiscountFormController,
  listDiscountTypeController,
  listVoucherStatusController,
  listPaymentController,
  listPackageController,
  listFromProvinceController,
  listToProvinceController,
  listCodeTypeController,
  listUserController,
  createVoucherSerialController,
  uploadImageController,
  getDetailVoucherSerialController,
  editVoucherSerialController,
} from "../controller/voucherSerialApis";
import { connect } from "react-redux";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";
import ImageUploader from "react-images-upload";

function CreateVoucher(props) {
  //====================== EDIT ========================
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  //api get detail voucher serial
  const [selectedDiscountForm, setSelectedDiscountForm] = useState();
  const [selectedVoucherType, setSelectedVoucherType] = useState();
  const [selectedCodeType, setSelectedCodeType] = useState();
  const [selectedListPackage, setSelectedListPackage] = useState([]);
  const [isSelectedAllPackage, setIsSelectedAllPackage] = useState(true);
  const [isSelectedListProvinceTo, setIsSelectedListProvinceTo] = useState();
  const [selectedDateValue, setSelectedDateValue] = useState();
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [isSelectedListProvinceFrom, setIsSelectedListProvinceFrom] =
    useState();
  const [data, setData] = useState({
    voucherSerialName: "",
    voucherType: null,
    voucherValue: null,
    title: "",
    shortName: "",
    content: "",
    desc: "",
    image: "",
    discountForm: null,
    vouchcerServiceApplication: 1,
    discountType: 1,
    packages: ["ALL"],
    startAt: "",
    endAt: "",
    typeArea: 0,
    provinceCodeFrom: [],
    provinceCodeTo: [],
    ishared: null,
    usage_limit: 1,
    personalUsageLimit: 1,
    status: 2,
    paymentMethod: [],
    minValueCodition: null,
    fromDateCondition: "2022-11-03",
    toDateCondition: "2022-12-03",
    userTypeCodition: 0,
    sexCondition: 2,
    fromAge: 14,
    toAge: 30,
    maxValue: null,
    baseOnCondition: 1,
    durationDayCondition: null,
    prefix: "",
    typeCode: 0,
    manualCode: "",
    packageUserCondition: [],
    userPhone: [],
  });
  //================================== CONFIG DATA ===================================
  const axiosListVoucherType = async () => {
    let response = await listVoucherTypeController(header);
    if (response.data && response.status === 200) {
      let result = [];
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListVoucherType(result);
    }
  };
  const axiosGetDetailVoucherSerial = async () => {
    let response = await getDetailVoucherSerialController(id, header);
    if (response.data && response.status === 200) {
      console.log(response.data);
      console.log(response.data.serialUserMaps);
      let listUserPhone = [];
      response.data.serialUserMaps.map((item) =>
        listUserPhone.push(item.phone)
      );
      if (listUserPhone != null && listUserPhone.length > 0) {
        let result = [];
        listUserPhone.map((item) => result.push({ value: item, label: item }));
        setSelectedUserId(result);
        console.log(listUserPhone);
        console.log(result);
        // console.log(selectedUserId);
      }

      let provinCodeList = [];
      provinCodeList = response.data.areaCondition.provinceCodes.split(",");
      // console.log(provinCodeList);
      if (response.data.areaCondition.type == 0) {
        setData({ ...data, provinceCodeTo: [] });
        setData({ ...data, provinceCodeFrom: [] });
        console.log("type 0");
      }
      if (response.data.areaCondition.type == 1) {
        setData({
          ...data,
          provinceCodeTo: provinCodeList,
        });
        let multiCheckedTo = document.getElementById("typeArePKTo");
        multiCheckedTo.style.display = "block";
        setDisablePkTo(false);
        console.log("type 1");
      }
      if (response.data.areaCondition.type == 2) {
        setData({
          ...data,
          provinceCodeFrom: provinCodeList,
        });
        let multiCheckedFrom = document.getElementById("typeArePKFrom");
        // multiCheckedFrom.style.display = "block";
        setDisablePkFrom(false);
        console.log("type 2");
      }
      console.log(response.data.condition.paymentMethod.split(","));
      setData({
        ...data,
        voucherSerialName: response.data.voucherSerial.name,
        voucherType: response.data.vapplicable.type,
        voucherValue: response.data.vapplicable.value,
        title: response.data.voucherSerial.title,
        shortName: response.data.voucherSerial.shortName,
        content: response.data.voucherSerial.content,
        desc: response.data.voucherSerial.desc,
        image:
          response.data.voucherSerial.image != null
            ? response.data.voucherSerial.image
            : "",
        discountForm: response.data.vapplicable.method,
        vouchcerServiceApplication: 1,
        discountType: response.data.vapplicable.applyFor,
        packages: response.data.objectCondition.shipPackages.split(","),
        startAt: response.data.voucherSerial.startAt,
        endAt: response.data.voucherSerial.endAt,
        typeArea: response.data.areaCondition.type,
        provinceCodeTo: response.data.areaCondition.provinceCodes.split(","),
        provinceCodeFrom: response.data.areaCondition.provinceCodes.split(","),
        ishared: response.data.voucherSerial.isShared,
        usage_limit: response.data.voucherSerial.usageLimit,
        personalUsageLimit: response.data.voucherSerial.personalUsageLimit,
        status: response.data.voucherSerial.status,
        paymentMethod: response.data.condition.paymentMethod.split(","),
        minValueCodition: response.data.valueCondition.minValue,
        fromDateCondition: response.data.valueCondition.fromDate,
        toDateCondition: response.data.valueCondition.toDate,
        userTypeCodition: 0,
        sexCondition: response.data.userCondition.sex,
        fromAge: response.data.userCondition.fromAge,
        toAge: response.data.userCondition.toAge,
        maxValue: response.data.vapplicable.maxValue,
        baseOnCondition: response.data.valueCondition.baseOn,
        durationDayCondition:
          response.data.valueCondition.duration != null
            ? response.data.valueCondition.duration
            : 1,
        prefix:
          response.data.voucherSerial.prefix != null
            ? response.data.voucherSerial.prefix
            : "",
        typeCode: response.data.voucherSerial.typeCode,
        manualCode:
          response.data.voucherSerial.manualCode != null
            ? response.data.voucherSerial.manualCode
            : "",
        packageUserCondition: [],
        userPhone: response.data.serialUserMaps != null ? listUserPhone : [],
        rejectReason: "tu choi",
        voucherSerialId: parseInt(id),
      });
      if (response.data.objectCondition.shipPackages.split(",")[0] !== "ALL") {
        setIsSelectedAllPackage(false);
        document.getElementById("multi_select").style.display = "block";
        if (
          response.data.objectCondition.shipPackages.split(",").length === 1
        ) {
          // Call get province list api for single package
          // console.log(event[0].code);
          const packageCode =
            response.data.objectCondition.shipPackages.split(",")[0];
          console.log(response.data.objectCondition.shipPackages.split(",")[0]);

          axiosGetListPackageFromProvince(packageCode);
          axiosGetListPackageToProvince(packageCode);
          setIsSinglePackage((isSinglePackage = false));
        }
      }
    }
  };

  const [image, setImage] = useState({
    file: "",
    username: "",
    file_type: "",
  });
  var [pkStatus, setPkStatus] = useState("");
  const [isCheckedServiceAppliaction, setCheckedServiceApplication] =
    useState(true);
  const [isCheckedPaymentMethod, setCheckedPaymentMethod] = useState(true);
  let [isSinglePackage, setIsSinglePackage] = useState(false);
  let [disablePkTo, setDisablePkTo] = useState(true);
  let [disablePkFrom, setDisablePkFrom] = useState(true);
  let [checkedTypeArea, setCheckedTypeArea] = useState(true);
  let [showModal, setShowModal] = useState(false);
  let [titleNoti, setTitleNoti] = useState("");
  let [messageNoti, setMessageNoti] = useState("");
  const [listVoucherType, setListVoucherType] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listServiceApplication, setListServiceApplication] = useState([]);
  const [listDiscountForm, setListDiscountForm] = useState([]);
  const [listDiscountType, setListDiscountType] = useState([]);
  const [listVoucherStatus, setListVoucherStatus] = useState([]);
  const [listPayment, setListPayment] = useState([]);
  const [listPackage, setListPackage] = useState([]);
  const [listProvinceCodeFrom, setListProvinceCodeFrom] = useState();
  const [listProvinceCodeTo, setListProvinceCodeTo] = useState();
  const [listCodeType, setListCodeType] = useState([]);
  const [validationMsg, setValidationMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlImage, setUrlImage] = useState();
  const [toProvinceCodeTempt, setToProvinceCodeTempt] = useState([]);
  const [fromProvinceCodeTempt, setFromProvinceCodeTempt] = useState([]);
  let [defaultValueVoucherType, setDefaultValueVoucherType] = useState([]);

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state

    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = (e) => {
    e.preventDefault();
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file", selectedFile, selectedFile.name);
    formData.append("username", "");
    formData.append("file_type", "");

    // Details of the uploaded file
    // console.log(selectedFile);

    // Request made to the backend api
    // Send formData object
    axios
      .post(
        "https://haloship.imediatech.com.vn/imedia/auth/media/upload_file",
        formData
      )
      .then((response) => {
        setData({ ...data, image: response.data.file_url });
        setUrlImage(
          "https://haloship.imediatech.com.vn/" + response.data.file_url
        );
      });
  };
  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (urlImage) {
      return (
        <div>
          <h2>File Details:</h2>
          <img src={urlImage} width="120px" height="auto" />
        </div>
      );
    } else if (data.image.length > 0) {
      let imgUploaded = "https://haloship.imediatech.com.vn/" + data.image;
      return (
        <div>
          <h2>Ảnh đã upload</h2>
          <img src={imgUploaded} width="120px" height="auto" />
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4 className="text-danger">Vui lòng chọn ảnh trước khi upload</h4>
        </div>
      );
    }
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const selectDate = (selectedDate) => {
    console.log(selectedDate);

    // setSelectedDateValue(selectedDate);
    console.log(selectedDateValue);
    if (selectedDate != null) {
      setData({
        ...data,
        startAt: formatDate(selectedDate[0]),
        endAt: formatDate(selectedDate[1]),
      });
    } else if (selectedDate == null) {
      setData({
        ...data,
        startAt: "",
        endAt: "",
      });
    }
  };
  const selectUserTypeCond = (selectedUserTypeCond) => {
    setData({
      ...data,
      userTypeCodition: parseInt(selectedUserTypeCond.target.value),
    });
  };
  const setPrefixCodeUppercase = () => {
    var prefix = document.getElementById("prefix");
    prefix.value = prefix.value.toUpperCase();
  };
  const setManualCodeUppercase = () => {
    var manualCode = document.getElementById("manualCode");
    manualCode.value = manualCode.value.toUpperCase();
  };
  const closeModalNoti = () => {
    setShowModal((showModal = false));
  };

  const openModalNoti = (titleNoti, messageNoti) => {
    setShowModal((showModal = true));
    setTitleNoti((titleNoti = titleNoti));
    setMessageNoti((messageNoti = messageNoti));
  };

  const animatedComponents = makeAnimated();
  let header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: props.token,
  };
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 35,
    }),
  };

  const axiosListUser = async (data) => {
    let result = [];
    let response = await listUserController(data, header);
    if (response.data && response.status === 200) {
      console.log(response.data.userList);
      response.data.userList.map((item) =>
        result.push({ value: item.phone, label: item.phone })
      );
      setListUser(result);
    }
  };
  const axiosListServiceApplication = async () => {
    let response = await listServiceApplicationController(header);
    if (response.data && response.status === 200) {
      setListServiceApplication(response.data);
    }
  };

  const axiosListDiscountForm = async () => {
    let result = [];
    let response = await listDiscountFormController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListDiscountForm(result);
    }
  };

  const axiosListDiscountType = async () => {
    let response = await listDiscountTypeController(header);
    if (response.data && response.status === 200) {
      setListDiscountType(response.data);
    }
  };

  const axiosListVoucherStatus = async () => {
    let response = await listVoucherStatusController(header);
    if (response.data && response.status === 200) {
      setListVoucherStatus(response.data);
    }
  };

  const axiosListPayment = async () => {
    let response = await listPaymentController(header);
    if (response.data && response.status === 200) {
      setListPayment(response.data.paymentMethodList);
    }
  };

  const axiosListPackage = async () => {
    let result1 = [];
    let response = await listPackageController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) => {
        let result2 = [];
        // console.log(item.list);
        item.list.map((item1) =>
          result2.push({
            value: item1.id,
            label: item1.name,
            code: item1.code,
          })
        );
        result1.push({
          label: item.priceSettingTypeName,
          options: result2,
        });
      });
      setListPackage(result1);
    }
  };
  const axiosListCodeType = async () => {
    let result = [];
    let response = await listCodeTypeController(header);
    if (response.data && response.status === 200) {
      // console.log(response.data);
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListCodeType(result);
    }
  };
  const [voucherTypeValue, setVoucherTypeValue] = useState();
  const selectVoucherType = (selectedVoucherType) => {
    setData({ ...data, voucherType: selectedVoucherType.value });
    setVoucherTypeValue(selectedVoucherType.value);
  };
  const selectDiscountForm = (selectedDiscountForm) => {
    setData({ ...data, discountForm: selectedDiscountForm.value });
  };
  const selectServiceApplication = (selectServiceApplication) => {
    setCheckedServiceApplication(false);
    setData({
      ...data,
      vouchcerServiceApplication: parseInt(
        selectServiceApplication.target.value
      ),
    });
  };

  const selectedPaymentMethod = (event) => {
    var methodList = data.paymentMethod;
    if (event.target.checked) {
      // Them payment method vao mang
      // methodList.push(event.target.value);
      if (methodList.indexOf(event.target.value) == -1) {
        methodList.push(event.target.value);
      }
    } else {
      // Loai payment method khoi mang
      methodList.splice(methodList.indexOf(event.target.value), 1);
      // methodList.pop(event.target.value);
    }

    setData({
      ...data,
      paymentMethod: methodList,
    });
    console.log(data.paymentMethod);
  };
  const selectStatus = (selectedStatus) => {
    setData({
      ...data,
      status: parseInt(selectedStatus.target.value),
    });
  };
  const selectDiscountType = (selectedDiscountType) => {
    setData({
      ...data,
      discountType: parseInt(selectedDiscountType.target.value),
    });
  };
  const selectTypeArea = (selectedTypeArea) => {
    setData({
      ...data,
      typeArea: selectedTypeArea.target.value,
    });

    if (selectedTypeArea.target.value !== 0) {
      setCheckedTypeArea(false);
    } else {
      setCheckedTypeArea(true);
    }

    setData({
      ...data,
      typeArea: parseInt(selectedTypeArea.target.value),
    });
  };
  const selectTypeCode = (selectedTypeCode) => {
    setData({
      ...data,
      typeCode: parseInt(selectedTypeCode.target.value),
    });
  };
  const axiosGetListPackageFromProvince = async (packageCode) => {
    let result = [];
    let response = await listFromProvinceController(packageCode, header);
    if (response.data && response.status === 200) {
      response.data.list.map((item) =>
        result.push({
          label: item.name,
          value: item.id,
          code: item.code,
        })
      );
      setListProvinceCodeFrom(result);
    }
  };

  const axiosGetListPackageToProvince = async (packageCode) => {
    let result = [];
    let response = await listToProvinceController(packageCode, header);
    if (response.data && response.status === 200) {
      response.data.list.map((item) =>
        result.push({
          label: item.name,
          value: item.id,
          code: item.code,
        })
      );

      setListProvinceCodeTo(result);
    }
  };

  const onChangeSelectPackage = (event) => {
    console.log(event);
    if (event.length === 1) {
      // Call get province list api for single package
      // console.log(event[0].code);
      const packageCode = event[0].code;
      axiosGetListPackageFromProvince(packageCode);
      axiosGetListPackageToProvince(packageCode);
      setIsSinglePackage((isSinglePackage = false));
      setData({ ...data, packages: [event[0].code] });
    } else if (event.length > 1) {
      // console.log(checkedTypeArea);
      setDisablePkFrom(true);
      setDisablePkTo(true);
      setCheckedTypeArea((checkedTypeArea = true));
      openModalNoti(
        "Lỗi !",
        "Không thể lựa chọn nhiều gói cước với khu vực áp dụng xác định, chọn khu vực áp dụng Toàn hệ thống để lựa chọn thêm gói cước khác"
      );
      setIsSinglePackage((isSinglePackage = true));
      let selecttedPackage = [];
      event.map(
        (item) => (selecttedPackage = [...selecttedPackage, String(item.code)])
      );
      setData({
        ...data,
        packages: selecttedPackage,
      });
      setSelectedListPackage(event);
    } else {
      setData({
        ...data,
        packages: ["ALL"],
      });
    }
  };
  var listProvinceTo = [];
  var listProvinceFrom = [];
  const selectProvinceTo = (selectedProvince) => {
    console.log(selectedProvince);
    if (selectedProvince.length === 1) {
      setData({ ...data, provinceCodeTo: [selectedProvince[0].code] });
    } else if (selectedProvince.length > 1) {
      let listSelectedProvinces = [];
      selectedProvince.map(
        (item) =>
          (listSelectedProvinces = [...listSelectedProvinces, item.code])
      );
      setData({
        ...data,
        provinceCodeTo: listSelectedProvinces,
      });
      listProvinceTo = [...listSelectedProvinces];
    }
    if (selectedProvince.length == 0) {
      setData({ ...data, provinceCodeTo: [] });
      console.log("set state cho provincodeTo");
    }
    console.log(listProvinceTo);
    console.log(data.provinceCodeTo);
  };
  const selectProvinceFrom = (selectedProvince) => {
    if (selectedProvince.length === 1) {
      setData({ ...data, provinceCodeFrom: [selectedProvince[0].code] });
    } else if (selectedProvince.length > 1) {
      let listSelectedProvinces = [];
      selectedProvince.map(
        (item) =>
          (listSelectedProvinces = [...listSelectedProvinces, item.code])
      );
      setData({
        ...data,
        provinceCodeFrom: listSelectedProvinces,
      });
      listProvinceFrom = [...listSelectedProvinces];
    }
    if (selectedProvince.length == 0) {
      setData({ ...data, provinceCodeFrom: [] });
    }
    console.log(listProvinceFrom);
  };
  const onChagePhoneNumber = (event) => {
    let phone = parseInt(event.target.value);

    //Call API get all user
    axiosListUser(phone, header);
  };
  const selectUserId = (selectedUserPhone) => {
    var listSelectedUsersId = [];
    if (!selectedUserPhone) {
      listSelectedUsersId = [];
    } else if (selectedUserPhone.length === 1) {
      listSelectedUsersId = [selectedUserPhone[0].value];
    } else if (selectedUserPhone.length > 1) {
      selectedUserPhone.map(
        (item) => (listSelectedUsersId = [...listSelectedUsersId, item.value])
      );
    }

    setData({ ...data, userPhone: listSelectedUsersId });
  };
  const selectPackageUserCondition = (selectedPackageUserCondition) => {
    if (selectedPackageUserCondition.length === 1) {
      setData({
        ...data,
        packageUserCondition: [
          selectedPackageUserCondition[0].value.toString(),
        ],
      });
    } else if (selectedPackageUserCondition.length > 1) {
      let listSelectedPackageUserConditions = [];
      selectedPackageUserCondition.map(
        (item) =>
          (listSelectedPackageUserConditions = [
            ...listSelectedPackageUserConditions,
            item.value.toString(),
          ])
      );
      setData({
        ...data,
        packageUserCondition: listSelectedPackageUserConditions,
      });
    }
  };
  const voucherTypeHtml = () => {
    switch (voucherTypeValue || data.voucherType) {
      case 1:
        return (
          <div className="form-group col-md-3 pdr-menu">
            <label htmlFor="exampleInputName1">Mệnh giá VNĐ (*)</label>
            <input
              type="number"
              className="form-control"
              placeholder="20,000vnđ"
              onChange={(e) =>
                setData({ ...data, voucherValue: parseInt(e.target.value) })
              }
              value={data.voucherValue}
            />
            <p className="text-danger">{validationMsg.voucherValue}</p>
          </div>
        );
      case 2:
        return (
          <>
            <div className="form-group col-md-3 pdr-menu">
              <label htmlFor="exampleInputName1">Phần trăm (%) (*)</label>
              <input
                type="number"
                className="form-control"
                placeholder="10%"
                onChange={(e) =>
                  setData({ ...data, voucherValue: e.target.value })
                }
                value={data.voucherValue}
              />
              <p className="text-danger">{validationMsg.voucherValue}</p>
            </div>
            <div className="form-group col-md-6 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số tiền áp dụng tối đa (*)
              </label>
              <div className="row">
                <div className="form-check col-md-4">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="ExampleRadio4"
                      checked
                    />{" "}
                    Dưới VNĐ
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="100000"
                    name="maxValue"
                    onChange={(e) =>
                      setData({ ...data, maxValue: parseInt(e.target.value) })
                    }
                    value={data.maxValue}
                  />
                  <p className="text-danger">{validationMsg.maxValue}</p>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  const [codeTypeValue, setCodeTypeValue] = useState();
  const selectCodeType = (selectedCodeType) => {
    // console.log(selectedCodeType);
    setData({ ...data, ishared: selectedCodeType.value });
    setCodeTypeValue(selectedCodeType.value);
  };

  const codeTypeHtml = () => {
    switch (codeTypeValue || data.ishared) {
      case 1:
        return (
          <>
            <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số lần sử dụng tối đa (*)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                onChange={(e) =>
                  setData({ ...data, usage_limit: parseInt(e.target.value) })
                }
                value={data.usage_limit}
                // value={data.usage_limit}
              />
              <p className="text-danger">{validationMsg.usage_limit1}</p>
            </div>
            <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số lượng tối đa cho 1 user (*)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="1"
                onChange={(e) =>
                  setData({
                    ...data,
                    personalUsageLimit: parseInt(e.target.value),
                  })
                }
                value={data.personalUsageLimit}
              />
              <p className="text-danger">{validationMsg.personalUsageLimit1}</p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group col-md-3 pdr-menu">
              <label htmlFor="exampleInputName1">Nhập số lượng mã (*)</label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                onChange={(e) =>
                  setData({ ...data, usage_limit: parseInt(e.target.value) })
                }
                value={data.usage_limit}
              />
              <p className="text-danger">{validationMsg.usage_limit2}</p>
            </div>
            <div className="form-group col-md-6 pdr-menu">
              <label htmlFor="exampleInputName1">Số lần sử dụng 1 mã(*)</label>
              <div className="row">
                <div className="form-group col-md-4 pdr-menu">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="1"
                    onChange={(e) =>
                      setData({
                        ...data,
                        personalUsageLimit: parseInt(e.target.value),
                      })
                    }
                    value={data.personalUsageLimit}
                  />
                  <p className="text-danger">
                    {validationMsg.personalUsageLimit2}
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div
              className="form-group col-md-8 pdr-menu"
              onChange={onChagePhoneNumber}
            >
              <label htmlFor="exampleInputName1">Chọn danh sách user (*)</label>
              <Select
                options={listUser}
                placeholder="Nhập số điện thoại"
                closeMenuOnSelect={true}
                components={animatedComponents}
                isMulti
                onChange={selectUserId}
                defaultValue={selectedUserId}
              />
              <p className="text-danger">{validationMsg.userId}</p>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  const codestructureHtml = () => {
    switch (codeTypeValue || data.ishared) {
      case 1:
        return (
          <>
            <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    value="1"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 1 ? true : false}
                  />{" "}
                  Tự động sinh mã
                  <i className="input-helper"></i>
                </label>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-check radio-select">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id="optionsRadios3"
                    value="2"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 2 ? true : false}
                  />
                  <i className="input-helper"></i>
                  Tự động sinh mã(tối đa 4 ký tự)
                </label>
                <input
                  type="text"
                  id="prefix"
                  className="form-control col-md-2"
                  placeholder="100"
                  onChange={(e) => setData({ ...data, prefix: e.target.value })}
                  onBlur={setPrefixCodeUppercase}
                  value={data.prefix}
                />
                <p className="text-danger">{validationMsg.prefix}</p>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    value="3"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 3 ? true : false}
                  />{" "}
                  Nhập mã (8 ký tự)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    Mã là chữ cái viết hoa hoặc số
                  </span>
                </label>
                <input
                  type="text"
                  id="manualCode"
                  className="form-control col-md-2"
                  placeholder="XYZ12345"
                  onChange={(e) =>
                    setData({ ...data, manualCode: e.target.value })
                  }
                  onBlur={setManualCodeUppercase}
                  value={data.manualCode}
                />
                <p className="text-danger">{validationMsg.manualCode}</p>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    value="1"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 1 ? true : false}
                  />{" "}
                  Tự động sinh mã
                  <i className="input-helper"></i>
                </label>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    value="2"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 2 ? true : false}
                  />{" "}
                  Tự động sinh mã với tiền tố(tối đa 4 ký tự)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    Mã là chữ cái viết hoa hoặc số
                  </span>
                </label>
                <input
                  type="text"
                  id="prefix"
                  className="form-control col-md-2"
                  placeholder="XYZT"
                  onChange={(e) => setData({ ...data, prefix: e.target.value })}
                  value={data.prefix}
                  onBlur={setPrefixCodeUppercase}
                />
                <p className="text-danger">{validationMsg.prefix}</p>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    value="1"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 1 ? true : false}
                  />{" "}
                  Tự động sinh mã
                  <i className="input-helper"></i>
                </label>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    value="2"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 2 ? true : false}
                  />{" "}
                  Tự động sinh mã với tiền tố(tối đa 4 ký tự)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    Mã là chữ cái viết hoa hoặc số
                  </span>
                </label>
                <input
                  type="text"
                  id="prefix"
                  className="form-control col-md-2"
                  placeholder="XYZT"
                  onChange={(e) => setData({ ...data, prefix: e.target.value })}
                  value={data.prefix}
                  onBlur={setPrefixCodeUppercase}
                />
                <p className="text-danger">{validationMsg.prefix}</p>
              </div>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };
  //show hide tiêu chí áp dụng mã có điều kiện và ko có điều kiện
  const showListConditional = () => {
    var yesConditional = document.getElementById("yesConditional");
    var listConditional = document.getElementById("listConditional");
    listConditional.style.display = yesConditional.checked ? "block" : "none";
  };
  //show/hide gói cước
  const showListPackage = (e) => {
    // console.log(e);
    console.log(e.target);
    console.log(data.packages);
    setPkStatus((pkStatus = e.target.value));
    // console.log(pkStatus);
    if (
      pkStatus !== "selectPackage" &&
      data.packages.length > 0 &&
      data.packages[0] === "ALL"
    ) {
      setData({ ...data, packages: [] });
    }
    if (pkStatus === "ALL") {
      setData({ ...data, packages: [] });
      setData({ ...data, packages: ["ALL"] });
      setData({ ...data, typeArea: 0 });
    }

    let pk = document.getElementById("pk");
    let multi_select = document.getElementById("multi_select");
    multi_select.style.display = pk.checked ? "block" : "none";
    setCheckedTypeArea((checkedTypeArea = true));
  };
  const disableByArea = (e) => {
    // setData({ ...data, typeArea: "" });

    let pkTo = document.getElementById("pkTo");
    let pkFrom = document.getElementById("pkFrom");
    pkTo.disabled = true;
    pkFrom.disabled = true;
    setCheckedTypeArea((checkedTypeArea = true));
    setIsSelectedAllPackage(true);
  };
  const unDisableByArea = (e) => {
    let pkTo = document.getElementById("pkTo");
    let pkFrom = document.getElementById("pkFrom");
    let selectByArea = document.getElementById("selectByArea");
    pkTo.disabled = false;
    pkFrom.disabled = false;
    setCheckedTypeArea((checkedTypeArea = true));
    setIsSelectedAllPackage(false);
  };

  let GroupHeading = (props) => (
    <div>
      <CheckboxGroupHeading className={[]} {...props} />
      <div width="100%">
        <FontAwesomeIcon
          icon="caret-down"
          className="checkbox-select-group-caret"
        />
      </div>
    </div>
  );

  const onClickSetTypeAreaTo = () => {
    setDisablePkTo(false);
    setDisablePkFrom(true);
    let multiCheckedTo = document.getElementById("typeArePKTo");
    multiCheckedTo.style.display = "block";
    let multiCheckedFrom = document.getElementById("typeArePKFrom");
    multiCheckedFrom.style.display = "none";
    //click khu vực giao,set data cho provineCodeFrom thành []
  };
  const onClickSetAllArea = () => {
    setDisablePkTo(true);
    setDisablePkFrom(true);
    let multiCheckedTo = document.getElementById("typeArePKTo");
    multiCheckedTo.style.display = "none";
    let multiCheckedFrom = document.getElementById("typeArePKFrom");
    multiCheckedFrom.style.display = "none";
    //click khu vực giao,set data cho provineCodeFrom thành []
  };
  const onClickSetTypeAreaFrom = () => {
    setDisablePkTo(true);
    setDisablePkFrom(false);
    let multiCheckedTo = document.getElementById("typeArePKTo");
    multiCheckedTo.style.display = "none";
    let multiCheckedFrom = document.getElementById("typeArePKFrom");
    multiCheckedFrom.style.display = "block";
  };

  //========================END CONFIG DATA========================

  //========================VALIDATE DATA========================

  const validateAll = () => {
    const msg = {};
    if (data.paymentMethod !== null && data.paymentMethod.length < 1) {
      msg.paymentMethod = "Vui lòng chọn hình thức thanh toán";
    }
    if (pkStatus === "selectPackage") {
      if (data.packages.length === 0 || data.packages[0] == "ALL") {
        msg.packages = "Vui lòng chọn gói cước";
      }
    }
    if (isEmpty(data.startAt) && isEmpty(data.endAt)) {
      msg.date = "Vui lòng chọn khoảng ngày";
    }
    let curdate = new Date().toJSON().slice(0, 10);
    if (curdate > data.startAt) {
      msg.date = "Ngày bắt đầu không hợp lệ";
    }

    if (data.typeArea === 1) {
      // setData({ ...data, provinceCodeFrom: [] });
      if (data.provinceCodeTo.length === 0) {
        msg.provinceCode1 = "Vui lòng chọn địa chỉ theo khu vực giao";
      }
    }
    if (data.typeArea === 2) {
      // setData({ ...data, provinceCodeTo: [] });
      console.log("set state cho provincodeTo");
      if (data.provinceCodeFrom.length === 0) {
        msg.provinceCode2 = "Vui lòng chọn địa chỉ theo khu vực gửi";
      }
    }

    if (
      isEmpty(data.voucherSerialName) ||
      data.voucherSerialName.length >= 255
    ) {
      msg.voucherSerialName = "Tên đợt phát hành không hợp lệ!";
    }
    if (isEmpty(data.shortName) || data.shortName.length >= 255) {
      msg.shortName = "Tên ngắn đợt phát hành không hợp lệ!";
    }
    if (isEmpty(data.content) || data.content.length >= 1000) {
      msg.content = "Nội dung đợt phát hành không hợp lệ!";
    }
    if (isEmpty(data.title) || data.title.length >= 255) {
      msg.title = "Tiêu đề đợt phát hành không hợp lệ!";
    }
    if (isEmpty(data.desc) || data.desc.length >= 1000) {
      msg.desc = "Mô tả đợt phát hành không hợp lệ!";
    }
    if (data.voucherType === 1) {
      if (data.voucherValue === null || data.voucherValue >= 2000000000) {
        msg.voucherValue = "Mệnh giá không hợp lệ!";
      }
    }
    if (data.voucherType === 2) {
      if (data.voucherValue === null || data.voucherValue >= 100) {
        msg.voucherValue = "Phần trăm không hợp lệ!";
      }
      if (data.maxValue === null || data.maxValue >= 2000000000) {
        msg.maxValue = "Điều kiện giá trị tối đa không hợp lệ!";
      }
    }
    if (data.ishared === null) {
      msg.ishared = "Vui lòng chọn loại mã";
    }
    //validate cấu trúc mã voucher
    if (data.ishared !== null) {
      if (data.typeCode === 0) {
        msg.typeCode = "Vui lòng chọn một cấu trúc mã voucher";
      }
    }
    // if (data.typeCode === 0) {
    //   msg.typeCode = "Vui lòng chọn một trong 3 loại mã";
    // }
    // if (data.ishared === null && data.typeCode === 0) {
    //   msg.typeCode = "Vui lòng chọn một trong 3 loại mã";
    // }
    // if (data.ishared === 1 && data.typeCode === 2) {
    //   if (isEmpty(data.prefix) || data.prefix.length > 4) {
    //     msg.prefix = "Không hợp lệ!";
    //   }
    // }

    // if (data.ishared === 1 && data.typeCode === 3) {
    //   // if (isEmpty(data.manualCode)) {
    //   //   msg.manualCode = "Không được bỏ trống trường này";
    //   // } else if (data.manualCode.length > 8) {
    //   //   msg.manualCode = "Không được nhập quá 8 kí tự";
    //   // }
    //   if (isEmpty(data.manualCode) || data.manualCode.length > 8) {
    //     msg.manualCode = "Không hợp lệ!";
    //   }
    // }

    //validate case loại 1 mã nhiều người sử dụng
    if (data.ishared === 1) {
      //Số lần sử dụng tối đa
      if (
        data.usage_limit === null ||
        data.usage_limit >= listUser.length ||
        isNaN(data.usage_limit)
      ) {
        msg.usage_limit1 = "Không hợp lệ!";
      }
      //Số lượng tối đa cho 1 user
      if (
        data.personalUsageLimit === null ||
        data.personalUsageLimit >= listUser.length ||
        isNaN(data.personalUsageLimit)
      ) {
        msg.personalUsageLimit1 = "Không hợp lệ!";
      }
      //Tự động sinh mã tối đa 4 ký tự

      if (data.typeCode === 2) {
        if (isEmpty(data.prefix) || data.prefix.length > 4) {
          msg.prefix = "Không hợp lệ!";
        }
      }
      //Nhập mã 8 ký tự
      if (data.typeCode === 3) {
        if (isEmpty(data.manualCode) || data.manualCode.length > 8) {
          msg.manualCode = "Không hợp lệ!";
        }
      }
    }
    //validate case loại mã yêu cầu nhập
    if (data.ishared === 2) {
      //Số lần sử dụng tối đa
      if (
        data.usage_limit === null ||
        data.usage_limit >= listUser.length ||
        isNaN(data.usage_limit)
      ) {
        msg.usage_limit2 = "Không hợp lệ!";
      }
      //Số lượng tối đa cho 1 user
      if (
        data.personalUsageLimit === null ||
        data.personalUsageLimit >= listUser.length ||
        isNaN(data.personalUsageLimit)
      ) {
        msg.personalUsageLimit2 = "Không hợp lệ!";
      }
      //Tự động sinh mã tối đa 4 ký tự

      if (data.typeCode === 2) {
        if (isEmpty(data.prefix) || data.prefix.length > 4) {
          msg.prefix = "Không hợp lệ!";
        }
      }
    }
    //validate case loại gán cho tài khoản
    if (data.ishared === 3) {
      //validate chọn danh sách user
      // if (data.userId !== null && data.userId.length < 1) {
      //   msg.userId = "Không được bỏ trống trường này";
      // }
      if (data.typeCode === 2) {
        if (isEmpty(data.prefix) || data.prefix.length > 4) {
          msg.prefix = "Không hợp lệ!";
        }
      }
    }
    //validate số lượng tối đa cho 1 user
    // if (data.ishared === 1 || data.ishared === 2) {
    //   if (data.usage_limit === null) {
    //     msg.usage_limit = "Không được bỏ trống trường này";
    //   }
    //   if (data.personalUsageLimit === null) {
    //     msg.personalUsageLimit = "Không được bỏ trống trường này";
    //   }
    // }

    // if (data.ishared === 3) {
    //   if (data.userId.length === 0) {
    //     msg.userId = "Không được bỏ trống trường này";
    //   }
    // }

    if (data.voucherType === null) {
      msg.voucherType = "Vui lòng chọn loại mã";
    }
    if (data.discountForm === null) {
      msg.discountForm = "Vui lòng chọn hình thức";
    }

    if (data.vouchcerServiceApplication === null) {
      msg.vouchcerServiceApplication = "Vui lòng chọn dịch vụ áp dụng";
    }
    if (data.paymentMethod === null) {
      msg.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    }
    if (data.status === null) {
      msg.status = "Vui lòng chọn trạng thái";
    }

    // if (data.userTypeCodition === 3) {
    //   if (data.packages.length === 0) {
    //     msg.package1 = "Vui lòng chọn gói cước";
    //   }
    // }
    // if (data.userTypeCodition === 4) {
    //   if (data.packages.length === 0) {
    //     msg.package2 = "Vui lòng chọn gói cước";
    //   }
    // }
    // if (data.voucherValue === null) {
    //   msg.voucherValue = "Không được bỏ trống trường này";
    // }
    // if (data.userTypeCodition === 5) {
    //   if (data.minValueCodition === null) {
    //     msg.minValueCodition = "Vui lòng nhập giá trị tiêu dùng tối thiểu";
    //   }
    //   if (data.durationDayCondition === null) {
    //     msg.durationDayCondition = "Vui lòng nhập số ngày";
    //   }
    // }
    setValidationMsg(msg);
    console.log(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const onSubmitRelease = () => {
    console.log("data create", data);

    const isValid = validateAll();
    if (!isValid) return;
    //Call API create
    createVoucherSerialController(header, JSON.stringify(data));
    console.log("Thêm thành công");
  };
  const onSubmitUpdate = () => {
    console.log(data);
    const isValid = validateAll();
    if (!isValid) return;
    console.log(data.packages);
    //Call API update
    editVoucherSerialController(JSON.stringify(data), header);
    console.log("Cập nhật thành công");
  };

  //========================END VALIDATE DATA========================

  useEffect(() => {
    // axiosGetDetailVoucherSerial();
    axiosListServiceApplication();
    axiosListDiscountForm();
    axiosListDiscountType();
    axiosListVoucherStatus();
    axiosListPayment();
    axiosListPackage();
    axiosGetListPackageFromProvince();
    axiosGetListPackageToProvince();
    axiosListCodeType();
    axiosListUser();
    axiosListVoucherType();
    axiosGetDetailVoucherSerial();
  }, [id]);
  useEffect(() => {
    if (listVoucherType != null && data.voucherType != null) {
      setSelectedVoucherType(
        listVoucherType.filter((item) => item.value === data.voucherType)
      );
      // console.log(selectedVoucherType);
    }
    if (listDiscountForm != null && data.discountForm != null) {
      setSelectedDiscountForm(
        listDiscountForm.filter((item) => item.value === data.discountForm)
      );
    }
    if (listCodeType != null && data.ishared != null) {
      setSelectedCodeType(
        listCodeType.filter((item) => item.value === data.ishared)
      );
    }
  }, [listCodeType, listDiscountForm, listVoucherType, data]);

  useEffect(() => {}, [
    selectedVoucherType,
    selectedDiscountForm,
    selectedCodeType,
  ]);
  useEffect(() => {
    if (
      listPackage != null &&
      listPackage[0] != null &&
      data.packages != null
    ) {
      setSelectedListPackage(
        listPackage[0].options
          .concat(listPackage[1].options)
          .filter((item) => data.packages.indexOf(item.code) > -1)
      );
    }
  }, [listPackage, data]);

  useEffect(() => {
    if (
      listProvinceCodeFrom != null &&
      listProvinceCodeFrom.length > 0 &&
      data.provinceCodeTo != null
    ) {
      setIsSelectedListProvinceTo(
        listProvinceCodeFrom.filter(
          (item) => data.provinceCodeTo.indexOf(item.code) > -1
        )
      );
    }
  }, [listProvinceCodeFrom, data]);
  useEffect(() => {
    if (
      listPackage != null &&
      listPackage[0] != null &&
      data.packages != null
    ) {
      setSelectedListPackage(
        listPackage[0].options
          .concat(listPackage[1].options)
          .filter((item) => data.packages.indexOf(item.code) > -1)
      );
    }
  }, [listPackage, data]);

  useEffect(() => {
    if (
      listProvinceCodeTo != null &&
      listProvinceCodeTo.length > 0 &&
      data.provinceCodeTo != null
    ) {
      setIsSelectedListProvinceTo(
        listProvinceCodeTo.filter(
          (item) => data.provinceCodeTo.indexOf(item.code) > -1
        )
      );
    }
  }, [listProvinceCodeTo, data]);
  // useEffect(() => {
  //   if (data.userPhone != null && data.userPhone.length > 0) {
  //     console.log(listUser);
  //     console.log(data.userPhone);

  //     // setSelectedUserId(
  //     //   data.userPhone
  //     //   // listUser.filter((item) => data.userId.indexOf(item.value + "") > -1)
  //     // );
  //   }
  // }, [data]);

  useEffect(() => {
    if (
      listProvinceCodeFrom != null &&
      listProvinceCodeFrom.length > 0 &&
      data.provinceCodeFrom != null
    ) {
      setIsSelectedListProvinceFrom(
        listProvinceCodeFrom.filter(
          (item) => data.provinceCodeFrom.indexOf(item.code) > -1
        )
      );
    }
  }, [listProvinceCodeFrom, data]);

  useEffect(() => {
    if (
      data.startAt != null &&
      data.endAt != null &&
      data.startAt != "" &&
      data.endAt != ""
    ) {
      setSelectedDateValue([new Date(data.startAt), new Date(data.endAt)]);
    }
  }, [data]);
  return (
    <div className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Thêm đợt phát hành E-voucher</h4>
            <p className="card-description"> Thông tin </p>
            <form className="forms-sample">
              <Form.Group>
                <label htmlFor="exampleInputName1">Tên đợt phát hành(*)</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="voucherSerialName"
                  placeholder="Tên đợt phát hành"
                  name="voucherSerialName"
                  onChange={(e) =>
                    setData({ ...data, voucherSerialName: e.target.value })
                  }
                  value={data.voucherSerialName}
                />
                <p className="text-danger">{validationMsg.voucherSerialName}</p>
              </Form.Group>
              <div className="row">
                <div className="form-group col-md-3 pdr-menu edit-card-select">
                  <label htmlFor="voucherType">Loại (*)</label>
                  <Select
                    options={listVoucherType}
                    onChange={selectVoucherType}
                    placeholder="Loại"
                    value={selectedVoucherType}
                  />
                  <p className="text-danger">{validationMsg.voucherType}</p>
                </div>
                {voucherTypeHtml()}
              </div>
              <div className="row">
                <div className="form-group col-md-4 pdr-menu edit-card-select">
                  <Form.Group>
                    <label htmlFor="shortName">Tên ngắn mã giảm giá (*)</label>
                    <Form.Control
                      name="shortName"
                      type="text"
                      className="form-control"
                      id="exampleInputEmail3"
                      placeholder="Tên ngắn mã giảm giá"
                      value={data.shortName}
                      onChange={(e) =>
                        setData({ ...data, shortName: e.target.value })
                      }
                      // value={data.shortName}
                    />
                    <p className="text-danger">{validationMsg.shortName}</p>
                  </Form.Group>
                </div>
                <div className="form-group col-md-4 pdr-menu edit-card-select">
                  <Form.Group>
                    <label htmlFor="exampleInputPassword4">
                      Tiêu đề mã giảm giá (*)
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputPassword4"
                      placeholder="Tiêu đề mã giảm giá"
                      onChange={(e) =>
                        setData({ ...data, title: e.target.value })
                      }
                      value={data.title}
                      // value={data.title}
                    />
                    <p className="text-danger">{validationMsg.title}</p>
                  </Form.Group>
                </div>
              </div>
              <Form.Group>
                <label htmlFor="content">Nội dung mã giảm giá (*)</label>
                <Form.Control
                  name="content"
                  type="text"
                  className="form-control"
                  id="content"
                  placeholder="Nội dung mã giảm giá"
                  onChange={(e) =>
                    setData({ ...data, content: e.target.value })
                  }
                  value={data.content}
                  // value={data.content}
                />
                <p className="text-danger">{validationMsg.content}</p>
              </Form.Group>
              <div className="row">
                <div className="form-group col-md-7 pdr-menu edit-card-select">
                  <Form.Group>
                    <label htmlFor="desc">Mô tả chi tiết (*)</label>
                    <Form.Control
                      name="desc"
                      type="text"
                      className="form-control"
                      id="desc"
                      placeholder="Mô tả chi tiết"
                      onChange={(e) =>
                        setData({ ...data, desc: e.target.value })
                      }
                      value={data.desc}
                      // value={data.desc}
                    />
                    <p className="text-danger">{validationMsg.desc}</p>
                  </Form.Group>
                </div>
                <div className="form-group col-md-4 pdr-menu edit-card-select">
                  <label htmlFor="">Thêm ảnh cho chi tiết</label>
                  <div>
                    <input type="file" onChange={onFileChange} />
                    <button onClick={onFileUpload}>Upload!</button>
                  </div>
                  {fileData()}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-5  pdr-menu edit-card-select">
                  <label htmlFor="discountForm">Hình thức (*)</label>
                  <Select
                    name="discountForm"
                    id="discountForm"
                    styles={customStyles}
                    options={listDiscountForm}
                    placeholder="Hình thức"
                    onChange={selectDiscountForm}
                    value={selectedDiscountForm}
                  />
                  <p className="text-danger">{validationMsg.discountForm}</p>
                </div>
              </div>
              <div className="row-fluid">
                <div className="col-md-12">
                  <Form.Group>
                    <h4 className="service">Dịch vụ áp dụng</h4>
                    <div className="row">
                      {listServiceApplication.map((item) => (
                        <div className="form-check form-check-primary col-md-4">
                          <label className="form-check-label">
                            <input
                              name="vouchcerServiceApplication"
                              type="checkbox"
                              key={item.code}
                              className="form-check-input"
                              value={item.code}
                              checked
                              onChange={selectServiceApplication}
                            />{" "}
                            {item.name}
                            <i className="input-helper"></i>
                          </label>
                          <p className="text-danger">
                            {validationMsg.vouchcerServiceApplication}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block">
                  Dựa trên (*)
                </label>
                {listDiscountType.map((item) => (
                  <div className="col-sm-4">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="discountType"
                          // defaultChecked={item.code === 2 ? true : false}
                          onChange={selectDiscountType}
                          value={item.code}
                          checked={
                            data.discountType === item.code ? true : false
                          }
                        />{" "}
                        {item.name}
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </div>
                ))}
              </Form.Group>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block">
                  Mặt hàng áp dụng (*)
                </label>
                <div className="col-sm-4">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="selectedPackage"
                        id="allPk"
                        onChange={showListPackage}
                        onClick={disableByArea}
                        // defaultChecked={true}
                        value="ALL"
                        checked={isSelectedAllPackage}
                      />{" "}
                      Tất cả gói cước
                      <i className="input-helper"></i>
                    </label>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="ExampleRadio5"
                        id="pk"
                        onChange={showListPackage}
                        onClick={unDisableByArea}
                        value="selectPackage"
                        checked={!isSelectedAllPackage}
                      />{" "}
                      Gói cước
                      <i className="input-helper"></i>
                    </label>
                  </div>
                </div>
                <div
                  className="col-sm-3"
                  style={{ display: "none" }}
                  id="multi_select"
                >
                  <ReactMultiSelectCheckboxes
                    options={listPackage}
                    classNamePrefix="gm"
                    components={{ GroupHeading }}
                    onChange={onChangeSelectPackage}
                    defaultValue={selectedListPackage}
                  />
                  <p className="text-danger">{validationMsg.packages}</p>
                </div>
              </Form.Group>
              <Form.Group className="mt-4 mb-4">
                <h5>Áp dụng</h5>
                <label htmlFor="exampleInputCity1" className="mr-3">
                  Hiệu lực từ
                </label>
                <DateRangePicker
                  className="datepicker d-inline-block"
                  onChange={selectDate}
                  value={selectedDateValue}
                />
                <p className="text-danger">{validationMsg.date}</p>
              </Form.Group>
              <Form.Group className="row-fluid">
                <h6>Phạm vi áp dụng mã (*)</h6>
                <div className="form-check col-md-12">
                  <label className="form-check-label" htmlFor="typeArea_all">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="typeArea"
                      value="0"
                      id="typeArea_all"
                      checked={data.typeArea == 0 ? true : false}
                      defaultChecked={true}
                      onChange={selectTypeArea}
                      onClick={onClickSetAllArea}
                    />
                    <i className="input-helper"></i>
                    Toàn bộ hệ thống
                  </label>
                </div>
                <div className="form-check radio-select">
                  <label className="form-check-label" htmlFor="pkTo">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="typeArea"
                      id="pkTo"
                      value="1"
                      onChange={selectTypeArea}
                      disabled={isSinglePackage}
                      checked={data.typeArea === 1 ? true : false}
                      onClick={onClickSetTypeAreaTo}
                    />
                    <i className="input-helper"></i>
                    Theo khu vực giao
                  </label>
                  <div id="typeArePKTo" style={{ display: "none" }}>
                    <ReactMultiSelectCheckboxes
                      id="selectByArea1"
                      options={listProvinceCodeFrom}
                      checked={data.typeArea === 2 ? true : false}
                      isDisabled={disablePkTo}
                      onChange={selectProvinceTo}
                      defaultValue={isSelectedListProvinceTo}
                    />
                  </div>

                  <p className="text-danger">{validationMsg.provinceCode1}</p>
                </div>
                <div className="form-check radio-select">
                  <label className="form-check-label" htmlFor="pkFrom">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="typeArea"
                      id="pkFrom"
                      value="2"
                      onChange={selectTypeArea}
                      disabled={isSinglePackage}
                      // onClick={(e) => setDisablePkFrom(false)}
                      onClick={onClickSetTypeAreaFrom}
                    />
                    <i className="input-helper"></i>
                    Theo khu vực gửi
                  </label>
                  <div id="typeArePKFrom" style={{ display: "none" }}>
                    <ReactMultiSelectCheckboxes
                      id="selectByArea2"
                      options={listProvinceCodeTo}
                      isDisabled={disablePkFrom}
                      onChange={selectProvinceFrom}
                      defaultValue={isSelectedListProvinceFrom}
                    />
                  </div>
                  <p className="text-danger">{validationMsg.provinceCode2}</p>
                </div>
              </Form.Group>
              <Form.Group className="row">
                <h6 className="col-md-12">Tiêu chí áp dụng mã (*)</h6>
                <div className="form-check col-md-6 ml-3">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="optionsRadios"
                      id="noConditional"
                      onClick={showListConditional}
                      defaultChecked={true}
                      onChange={selectUserTypeCond}
                      value="0"
                    />
                    <i className="input-helper"></i>
                    Không có điều kiện
                  </label>
                </div>
                <div className="form-check col-md-5">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="optionsRadios"
                      id="yesConditional"
                      onClick={showListConditional}
                    />
                    <i className="input-helper"></i>
                    Có điều kiện
                  </label>
                  <ul
                    id="listConditional"
                    className="list-conditional"
                    style={{ display: "none" }}
                  >
                    <li>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="optionsRadios"
                            id="optionsRadios1"
                            value="1"
                            onChange={selectUserTypeCond}
                          />
                          <i className="input-helper"></i>
                          Chưa từng lên đơn của tất cả gói cước
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="optionsRadios"
                            id="optionsRadios1"
                            value="2"
                            onChange={selectUserTypeCond}
                          />
                          <i className="input-helper"></i>
                          Đã từng lên đơn của tất cả gói cước
                        </label>
                      </div>
                    </li>
                    {/* <li>
                      <div className="form-check radio-select">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="optionsRadios"
                            id="optionsRadios2"
                            value="3"
                            onChange={selectUserTypeCond}
                          />
                          <i className="input-helper"></i>
                          Chưa từng lên đơn của gói cước
                        </label>
                        <ReactMultiSelectCheckboxes
                          options={listPackage}
                          classNamePrefix="gm"
                          components={{ GroupHeading }}
                          onChange={selectPackageUserCondition}
                        />
                        <p className="text-danger">{validationMsg.package1}</p>
                      </div>
                    </li>
                    <li>
                      <div className="form-check radio-select">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="optionsRadios"
                            id="optionsRadios3"
                            value="4"
                            onChange={selectUserTypeCond}
                          />
                          <i className="input-helper"></i>
                          Đã từng lên đơn của gói cước
                        </label>
                        <ReactMultiSelectCheckboxes
                          options={listPackage}
                          classNamePrefix="gm"
                          components={{ GroupHeading }}
                          onChange={selectPackageUserCondition}
                        />
                        <p className="text-danger">{validationMsg.package2}</p>
                      </div>
                    </li>
                    <li>
                      <div className="form-check radio-select">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="optionsRadios"
                            id="optionsRadios3"
                            value="5"
                            onChange={selectUserTypeCond}
                          />
                          <i className="input-helper"></i>
                          Tiêu dùng tối thiểu
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) =>
                            setData({
                              ...data,
                              minValueCodition: parseInt(e.target.value),
                            })
                          }
                          value={data.minValueCodition}
                        />
                        <p className="text-danger">
                          {validationMsg.minValueCodition}
                        </p>
                        VNĐ Trong
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) =>
                            setData({
                              ...data,
                              durationDayCondition: parseInt(e.target.value),
                            })
                          }
                          value={data.durationDayCondition}
                        />
                        <p className="text-danger">
                          {validationMsg.durationDayCondition}
                        </p>
                        Ngày
                      </div>
                    </li> */}
                  </ul>
                </div>
              </Form.Group>
              <div className="row">
                <div className="form-group col-md-3 pdr-menu edit-card-select">
                  <label htmlFor="exampleInputName1">Loại mã (*)</label>
                  <Select
                    name="ishared"
                    styles={customStyles}
                    options={listCodeType}
                    placeholder="Chọn loại mã"
                    onChange={selectCodeType}
                    value={selectedCodeType}
                  />
                  <p className="text-danger">{validationMsg.ishared}</p>
                </div>
                {codeTypeHtml()}
              </div>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block">
                  Cấu trúc mã voucher (*)
                </label>
                <p className="text-danger">{validationMsg.typeCode}</p>
                {codestructureHtml()}
              </Form.Group>
              <div className="row-fluid">
                <div className="col-md-12">
                  <Form.Group className="row">
                    <h4 className="col-md-12 service">
                      Phương thức thanh toán
                    </h4>
                    {listPayment.map((item) => (
                      <div className="form-check form-check-primary col-md-4">
                        <label className="form-check-label">
                          <input
                            name="paymentMethod"
                            id="paymentMethod"
                            type="checkbox"
                            className="form-check-input checkboxPayment"
                            value={item.code}
                            onClick={selectedPaymentMethod}
                            checked={
                              data.paymentMethod.indexOf(item.code + "") > -1
                            }
                          />{" "}
                          {item.name}
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    ))}
                    <p className="text-danger col-md-12 p-0">
                      {validationMsg.paymentMethod}
                    </p>
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block">
                  Trạng thái (*)
                </label>
                {listVoucherStatus.map((item) => (
                  <div className="col-sm-2">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="status"
                          onChange={selectStatus}
                          value={item.code}
                          checked={data.status === item.code ? true : false}
                          // defaultChecked={item.code === 1 ? true : false}
                          // disabled={
                          //   item.code === 2 ||
                          //   item.code === 3 ||
                          //   item.code === 4 ||
                          //   item.code === 5 ||
                          //   item.code === 6
                          //     ? true
                          //     : false
                          // }
                        />{" "}
                        {item.name}
                        <i className="input-helper"></i>
                      </label>
                      {/* <p className="text-danger">{validationMsg.status}</p> */}
                    </div>
                  </div>
                ))}
              </Form.Group>
              <button
                type="button"
                className="btn btn-gradient-secondary mr-2"
                disabled={true}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-gradient-success mr-2"
                onClick={onSubmitRelease}
              >
                Phát hành
              </button>
              <button
                type="button"
                className="btn btn-gradient-primary mr-2"
                // disabled={true}
                onClick={onSubmitUpdate}
              >
                Cập nhật
              </button>
            </form>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModalNoti}>
        <Modal.Header closeButton>
          <Modal.Title>{titleNoti}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageNoti}</Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModalNoti}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
//get token
const mapStateToProps = (state) => {
  return {
    token: state.authReducer.detail.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveCustomerInfo: (data) => dispatch(saveCustomerInfo(data)),
  };
};

//====================================================================================================
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  CreateVoucher
  // EditVoucherSerial
);
