import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal } from "react-bootstrap";
import Select from "react-select";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import DateRangePicker from "rsuite/DateRangePicker";
import makeAnimated from "react-select/animated";
import isEmpty from "validator/lib/isEmpty";
import { Link } from "react-router-dom";
import { Store } from "react-notifications-component";
import { connect } from "react-redux";
import CurrencyInput from "react-currency-input-field";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";
import { useHistory } from "react-router-dom";
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
  listCodeTypeController,
  listUserController,
  createVoucherSerialController,
  getDetailVoucherSerialController,
  editVoucherSerialController,
  requestRelaseVoucherSerial,
  getAllProvinceController,
  getUserDetailController,
} from "../controller/voucherSerialApis";

function CreateVoucher(props) {
  //========================================== GET ROLE =================================================
  let header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: props.token,
  };
  const [role, setRole] = useState("");
  // api get role
  const axiosGetRoleUser = async () => {
    let response = await getUserDetailController(header);
    setRole(response.role);
  };

  //======================================== TYPE PAGE =================================================
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const copyFromId = queryParams.get("copyFromId");
  let page = id ? "update" : copyFromId ? "copy" : "create";

  //======================================== CONFIG DATA ===============================================

  let history = useHistory();
  const { beforeToday } = DateRangePicker;
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 35,
    }),
  };

  let Group = (props) => {
    const { children, label } = props;
    const expanded = props.data.expanded;
    return (
      <div>
        <div>
          <div width="100%">
            <p className="font-weight-bold">{label}</p>
          </div>
        </div>
        <div style={{ display: expanded ? "block" : "none" }}>{children}</div>
      </div>
    );
  };
  // Th??ng b??o : success danger info default warning
  const callNotify = (type, message, time) => {
    Store.addNotification({
      title: "Th??ng b??o",
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: time,
        onScreen: true,
      },
    });
  };
  const animatedComponents = makeAnimated();
  const STATUS_WAIT_APPROVE = 1; //ch??? duy???t
  const STATUS_REJECT = 2; //t??? ch???i duy???t
  const STATUS_APPROVED = 3; //???? duy???t
  const STATUS_PUBLISHED = 4; //???? ph??t h??nh
  const STATUS_PAUSE = 5; //t???m d???ng
  const STATUS_CANCEL = 6; //h???y
  const STATUS_EXPIRED = 7; //?????t ph??t h??nh h???t h???n

  const [listVoucherType, setListVoucherType] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listServiceApplication, setListServiceApplication] = useState([]);
  const [listDiscountForm, setListDiscountForm] = useState([]);
  const [listDiscountType, setListDiscountType] = useState([]);
  const [listVoucherStatus, setListVoucherStatus] = useState([]);
  const [listPayment, setListPayment] = useState([]);
  const [listPackage, setListPackage] = useState([]);
  const [listProvinceCode, setListProvinceCode] = useState([]);
  const [listCodeType, setListCodeType] = useState([]);
  const [validationMsg, setValidationMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlImage, setUrlImage] = useState();
  const [selectedDiscountForm, setSelectedDiscountForm] = useState();
  const [selectedVoucherType, setSelectedVoucherType] = useState();
  const [selectedCodeType, setSelectedCodeType] = useState();
  const [selectedListPackage, setSelectedListPackage] = useState([]);
  const [isSelectedAllPackage, setIsSelectedAllPackage] = useState(true);
  const [isSelectedListProvinceTo, setIsSelectedListProvinceTo] = useState();
  const [isSelectedListProvinceFrom, setIsSelectedListProvinceFrom] =
    useState();
  const [selectedDateValue, setSelectedDateValue] = useState();
  const [voucherTypeValue, setVoucherTypeValue] = useState();
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [isDisableRejectReason, setIsDisableRejectReason] = useState(true);
  const [displayPrefix, setDisplayPrefix] = useState("none");
  const [displayManualCode, setDisplayManualCode] = useState("none");
  const [curentPackageType, setCurentPackageType] = useState("");
  const [currentTypeArea, setCurrentTypeArea] = useState(null);
  var [pkStatus, setPkStatus] = useState("");
  const [isCheckedServiceAppliaction, setCheckedServiceApplication] =
    useState(true);
  let [isSinglePackage, setIsSinglePackage] = useState(true);
  let [disablePkTo, setDisablePkTo] = useState(true);
  let [disablePkFrom, setDisablePkFrom] = useState(true);
  let [checkedTypeArea, setCheckedTypeArea] = useState(true);
  let [showModal, setShowModal] = useState(false);
  let [titleNoti, setTitleNoti] = useState("");
  let [messageNoti, setMessageNoti] = useState("");
  const [dataRequestReleaseVoucherSerial, setDataRequestReleaseVoucherSerial] =
    useState({
      id: parseInt(id),
    });
  const [data, setData] = useState({
    voucherSerialName: "",
    voucherType: 1,
    voucherValue: null,
    title: "",
    shortName: "",
    content: "",
    desc: "",
    image: "",
    discountForm: 2,
    vouchcerServiceApplication: 1,
    discountType: 1,
    packages: ["ALL"],
    startAt: "",
    endAt: "",
    typeArea: 0,
    provinceCodeFrom: [],
    provinceCodeTo: [],
    ishared: 1,
    status: 1,
    paymentMethod: ["2"], //m???c ?????nh pttt l?? v?? hola
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
    typeCode: 1,
    manualCode: "",
    packageUserCondition: [],
    userPhone: [],
    amountVoucher: 1,
    serialUsageLimit: 1,
    voucherUsageLimit: 1,
  });
  const [disable, setDisable] = useState({
    voucherSerialName: false,
    voucherType: false,
    voucherValue: false,
    title: false,
    shortName: false,
    content: false,
    desc: false,
    image: false,
    discountForm: false,
    vouchcerServiceApplication: false,
    discountType: false,
    packages: false,
    startAt: false,
    endAt: false,
    typeArea: false,
    provinceCodeFrom: false,
    provinceCodeTo: false,
    ishared: false,
    status: null,
    paymentMethod: false,
    minValueCodition: false,
    fromDateCondition: false,
    toDateCondition: false,
    userTypeCodition: false,
    sexCondition: false,
    fromAge: false,
    toAge: false,
    maxValue: false,
    baseOnCondition: false,
    durationDayCondition: false,
    prefix: false,
    typeCode: false,
    manualCode: false,
    packageUserCondition: false,
    userPhone: false,
    amountVoucher: false,
    serialUsageLimit: false,
    voucherUsageLimit: false,
  });
  //X??a ???nh
  const removeImage = (e) => {
    setData({
      ...data,
      image: "",
    });
    setUrlImage("");
  };
  // File select
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // Hi???n th??? ???nh upload
  const fileData = () => {
    if (urlImage) {
      return (
        <div>
          <h4>File Details:</h4>
          <img src={urlImage} width="120px" height="auto" />
          <button>
            {" "}
            <i
              className="mdi mdi-window-close btn-close"
              onClick={removeImage}
            ></i>
          </button>
        </div>
      );
    } else if (data.image != null && data.image.length > 0) {
      let imgUploaded = "https://haloship.imediatech.com.vn/" + data.image;
      return (
        <div>
          <h4>???nh ???? upload</h4>
          <img src={imgUploaded} width="120px" height="auto" />
          <button>
            {" "}
            <i
              className="mdi mdi-window-close btn-close"
              onClick={removeImage}
            ></i>
          </button>
        </div>
      );
    } else if (data.image === "" || data.image == null) {
      return (
        <div>
          <br />
          <h4 className="text-danger">Vui l??ng ch???n ???nh tr?????c khi upload</h4>
        </div>
      );
    }
  };

  //L?? do t??? ch???i duy???t
  const onChangeRejectReason = (event) => {
    setData({
      ...data,
      rejectReason: event.target.value,
    });
  };
  //?????nh d???ng ng??y-th??ng-n??m
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };
  //onchange ch???n ng??y
  const selectDate = (selectedDate) => {
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
  //onchange ti??u ch?? ??p d???ng m??
  const selectUserTypeCond = (selectedUserTypeCond) => {
    setData({
      ...data,
      userTypeCodition: parseInt(selectedUserTypeCond.target.value),
    });
  };
  //????ng modal th??ng b??o
  const closeModalNoti = () => {
    setShowModal((showModal = false));
  };
  //m??? modal th??ng b??o
  const openModalNoti = (titleNoti, messageNoti) => {
    setShowModal((showModal = true));
    setTitleNoti((titleNoti = titleNoti));
    setMessageNoti((messageNoti = messageNoti));
  };
  //onchange lo???i m?? (voucher/e-coupon)
  const selectVoucherType = (selectedVoucherType) => {
    setData({ ...data, voucherType: selectedVoucherType.value });
    setVoucherTypeValue(selectedVoucherType.value);
  };
  //onchange h??nh th???c
  const selectDiscountForm = (selectedDiscountForm) => {
    setData({ ...data, discountForm: selectedDiscountForm.value });
  };
  //onchange d???ch v??? ??p d???ng
  const selectServiceApplication = (selectServiceApplication) => {
    setCheckedServiceApplication(false);
    setData({
      ...data,
      vouchcerServiceApplication: parseInt(
        selectServiceApplication.target.value
      ),
    });
  };
  //onchange ph????ng th???c thanh to??n
  const selectedPaymentMethod = (event) => {
    var methodList = data.paymentMethod;
    if (event.target.checked) {
      // Them payment method vao mang
      if (methodList.indexOf(event.target.value) == -1) {
        methodList.push(event.target.value);
      }
    } else {
      // Loai payment method khoi mang
      methodList.splice(methodList.indexOf(event.target.value), 1);
    }
    setData({
      ...data,
      paymentMethod: methodList,
    });
  };
  //onchange tr???ng th??i ?????t ph??t h??nh
  const selectStatus = (selectedStatus) => {
    if (selectedStatus.target.value == 6) {
      openModalNoti(
        "Ch?? ?? !",
        "B???n ??ang ch???n h???y ?????t ph??t h??nh Voucher? B???m ???C???p nh???t??? ????? h???y"
      );
    }
    if (selectedStatus.target.value == 2) {
      setIsDisableRejectReason(false);
    } else {
      setIsDisableRejectReason(true);
    }
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
  //onchange ph???m vi ??p d???ng m??
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
  //onchange c???u tr??c m?? voucher
  const selectTypeCode = (selectedTypeCode) => {
    if (selectedTypeCode.target.value == 1) {
      setDisplayManualCode("none");
      setDisplayPrefix("none");
    }
    if (selectedTypeCode.target.value == 2) {
      setDisplayManualCode("block");
      setDisplayPrefix("none");
    }
    if (selectedTypeCode.target.value == 3) {
      setDisplayPrefix("block");
      setDisplayManualCode("none");
    }
    setData({
      ...data,
      typeCode: parseInt(selectedTypeCode.target.value),
    });
  };
  //onchange g??i c?????c
  const onChangeSelectPackage = (event) => {
    if (event.length === 1) {
      // Call get province list api for single package
      const packageCode = event[0].code;
      setIsSinglePackage((isSinglePackage = false));
      setData({ ...data, packages: [event[0].code] });
    } else if (event.length == 0) {
      setData({
        ...data,
        packages: [],
      });
    } else if (event.length > 1) {
      setDisablePkFrom(true); //ch???n tr??n > 1 g??i c?????c disable theo khu v???c g???i
      setDisablePkTo(true); //ch???n tr??n > 1 g??i c?????c disable theo khu v???c giao
      setCheckedTypeArea((checkedTypeArea = true));
      if (data.typeArea != 0) {
        openModalNoti(
          "L???i !",
          "Kh??ng th??? l???a ch???n nhi???u g??i c?????c v???i khu v???c ??p d???ng x??c ?????nh, ch???n khu v???c ??p d???ng To??n h??? th???ng ????? l???a ch???n th??m g??i c?????c kh??c"
        );
      }
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
        packages: [],
      });
      setData({
        ...data,
        typeArea: 0,
      });
    }
  };
  var listProvinceTo = [];
  var listProvinceFrom = [];
  //onchange g??i c?????c theo khu v???c giao
  const selectProvinceTo = (selectedProvince) => {
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
    }
  };
  //onchange g??i c?????c theo khu v???c g???i
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
  };
  //onchange s??? ??i???n tho???i c???a ng?????i d??ng
  const onChagePhoneNumber = (event) => {
    let phone = parseInt(event.target.value);
    //Call API get all user
    axiosListUser(phone, header);
  };
  //onchange select user
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
  //onchange g??i c?????c theo ??i???u ki???n
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
  //tr??? v??? c???u tr??c html d???a theo lo???i voucher/e-coupon
  const voucherTypeHtml = () => {
    switch (voucherTypeValue || data.voucherType) {
      case 1:
        return (
          <div className="form-group col-md-3 pdr-menu">
            <label htmlFor="exampleInputName1" className="font-weight-bold">
              M???nh gi?? VN?? (*)
            </label>
            <CurrencyInput
              id="input-example"
              className="form-control"
              placeholder="20,000"
              decimalsLimit={2}
              decimalSeparator="."
              groupSeparator=","
              onValueChange={(value) =>
                setData({
                  ...data,
                  voucherValue: value ? parseInt(value) : value,
                })
              }
              value={data.voucherValue}
              disabled={disable.voucherValue}
            />
            <p className="text-danger">{validationMsg.voucherValue}</p>
          </div>
        );
      case 2:
        return (
          <>
            <div className="form-group col-md-3 pdr-menu">
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                Ph???n tr??m (%) (*)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="10"
                max="100"
                onChange={(e) =>
                  setData({ ...data, voucherValue: parseInt(e.target.value) })
                }
                value={data.voucherValue}
                disabled={disable.voucherValue}
              />
              <p className="text-danger">{validationMsg.voucherValue}</p>
            </div>
            <div className="form-group col-md-6 pdr-menu">
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                S??? ti???n ??p d???ng t???i ??a (*)
              </label>
              <div className="row">
                <div className="form-check col-md-4">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="ExampleRadio4"
                      defaultChecked
                      disabled={disable.maxValue}
                    />{" "}
                    D?????i (VN??)
                  </label>
                </div>
                <div className="col-md-4">
                  <CurrencyInput
                    id="input-example"
                    className="form-control"
                    placeholder="10,000"
                    decimalsLimit={2}
                    decimalSeparator="."
                    groupSeparator=","
                    onValueChange={(value) =>
                      setData({
                        ...data,
                        maxValue: value ? parseInt(value) : value,
                      })
                    }
                    value={data.maxValue}
                    disabled={disable.maxValue}
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
  //onchange lo???i m??
  const [codeTypeValue, setCodeTypeValue] = useState();
  const selectCodeType = (selectedCodeType) => {
    setData({ ...data, ishared: selectedCodeType.value });
    setCodeTypeValue(selectedCodeType.value);
  };
  //tr??? v??? c???u tr??c html d???a theo lo???i m??
  const codeTypeHtml = () => {
    switch (codeTypeValue || data.ishared) {
      case 1:
        return (
          <>
            <div className="form-group   pdr-menu">
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                S??? l???n s??? d???ng t???i ??a c???a ?????t ph??t h??nh(*)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                onChange={(e) =>
                  setData({
                    ...data,
                    serialUsageLimit: parseInt(e.target.value),
                  })
                }
                value={data.serialUsageLimit}
                disabled={disable.serialUsageLimit}
                min="1"
              />
              <p className="text-danger">{validationMsg.serialUsageLimit}</p>
            </div>
            {/* <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                S??? l?????ng t???i ??a cho 1 voucher (*)
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="1"
                onChange={(e) =>
                  setData({
                    ...data,
                    voucherUsageLimit: parseInt(e.target.value),
                  })
                }
                value={data.voucherUsageLimit}
                disabled={disable.voucherUsageLimit}
              />
              <p className="text-danger">{validationMsg.voucherUsageLimit1}</p>
            </div> */}
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group col-md-4 p-0">
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                Nh???p s??? l?????ng voucher (*)
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="100"
                onChange={(e) =>
                  setData({ ...data, amountVoucher: parseInt(e.target.value) })
                }
                value={data.amountVoucher}
                disabled={disable.amountVoucher}
              />
              <p className="text-danger">{validationMsg.amountVoucher}</p>
            </div>
            <div className="form-group col-md-3 pl-2">
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                S??? l???n s??? d???ng 1 m??(*)
              </label>

              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="1"
                onChange={(e) =>
                  setData({
                    ...data,
                    voucherUsageLimit: parseInt(e.target.value),
                  })
                }
                value={data.voucherUsageLimit}
                disabled={disable.voucherUsageLimit}
              />
              <p className="text-danger">{validationMsg.voucherUsageLimit2}</p>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div
              className="form-group col-sm-7 pdr-menu"
              onChange={onChagePhoneNumber}
            >
              <label htmlFor="exampleInputName1" className="font-weight-bold">
                Ch???n danh s??ch user (*)
              </label>
              <Select
                options={listUser}
                placeholder="Nh???p s??? ??i???n tho???i"
                closeMenuOnSelect={true}
                components={animatedComponents}
                isMulti
                onChange={selectUserId}
                defaultValue={selectedUserId}
                isDisabled={disable.userPhone}
              />
              <p className="text-danger">{validationMsg.userId}</p>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };
  //Tr??? v??? c???u tr??c html c???a c??c n??t ??i???u khi???n theo trang,role,tr???ng th??i ?????t ph??t h??nh
  const actionHtml = () => {
    const backHtml = () => {
      return (
        <Link to="listVoucherSerial">
          <Button className="btn btn-gradient-warning mr-2"> Tr??? v???</Button>
        </Link>
      );
    };
    const updatehtml = () => {
      return (
        <button
          type="button"
          className="btn btn-gradient-primary mr-2"
          disabled={page == "update" ? false : true}
          onClick={onSubmitUpdate}
        >
          C???p nh???t
        </button>
      );
    };
    switch (page) {
      //m??n create v?? copy gi???ng nhau
      case "create":
      case "copy":
        return (
          <>
            {backHtml()}
            <button
              type="button"
              className="btn btn-gradient-success mr-2"
              onClick={onSubmitRelease}
              disabled={
                page == "create" ? false : true || page == "copy" ? false : true
              }
            >
              Th??m m???i
            </button>
          </>
        );
      case "update":
        //============?????T PH??T H??NH H???T H???N================
        let curdate = new Date().toJSON().slice(0, 10);
        if (curdate > data.endAt) {
          return (
            <>
              {backHtml()}
              {/* {updatehtml()} */}
            </>
          );
        } else {
          //============?????T PH??T H??NH C??N H???N============
          //Tr???ng th??i ch??? duy???t
          if (disable.status === STATUS_WAIT_APPROVE) {
            //role admin
            if (role == "ADMIN") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role nh??n vi??n kinh doanh
            if (role == "SALE") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role tr?????ng ph??ng
            if (role == "MANAGER") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role ?????i so??t
            if (role == "DOISOAT") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
          }
          //Tr???ng th??i t??? ch???i duy???t
          if (disable.status === STATUS_REJECT) {
            //role admin
            if (role == "ADMIN") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role nh??n vi??n kinh doanh
            if (role == "SALE") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role tr?????ng ph??ng
            if (role == "MANAGER") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role ?????i so??t
            if (role == "DOISOAT") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
          }
          //Tr???ng th??i ???? duy???t
          if (disable.status === STATUS_APPROVED) {
            //role admin
            if (role == "ADMIN") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role nh??n vi??n kinh doanh
            if (role == "SALE") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role tr?????ng ph??ng
            if (role == "MANAGER") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role ?????i so??t
            if (role == "DOISOAT") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
          }
          //Tr???ng th??i ???? ph??t h??nh
          if (disable.status === STATUS_PUBLISHED) {
            //role admin
            if (role == "ADMIN") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role nh??n vi??n kinh doanh
            if (role == "SALE") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role tr?????ng ph??ng
            if (role == "MANAGER") {
              return (
                <>
                  {backHtml()}
                  {updatehtml()}
                </>
              );
            }
            //role ?????i so??t
            if (role == "DOISOAT") {
              return (
                <>
                  {backHtml()}

                  {updatehtml()}
                </>
              );
            }
          }
          //Tr???ng th??i T???m d???ng
          if (disable.status === STATUS_PAUSE) {
            //role admin
            if (role == "ADMIN") {
              return (
                <>
                  {backHtml()}

                  {updatehtml()}
                </>
              );
            }
            //role nh??n vi??n kinh doanh
            if (role == "SALE") {
              return (
                <>
                  {backHtml()}

                  {updatehtml()}
                </>
              );
            }
            //role tr?????ng ph??ng
            if (role == "MANAGER") {
              return (
                <>
                  {backHtml()}

                  {updatehtml()}
                </>
              );
            }
            //role ?????i so??t
            if (role == "DOISOAT") {
              return (
                <>
                  {backHtml()}

                  {updatehtml()}
                </>
              );
            }
          }
          //Tr???ng th??i H???y
          if (disable.status === STATUS_CANCEL) {
            //role admin
            if (role == "ADMIN") {
              return (
                <>
                  {backHtml()}
                  {/* {updatehtml()} */}
                </>
              );
            }
            //role nh??n vi??n kinh doanh
            if (role == "SALE") {
              return <>{backHtml()}</>;
            }
            //role tr?????ng ph??ng
            if (role == "MANAGER") {
              return <>{backHtml()}</>;
            }
            //role ?????i so??t
            if (role == "DOISOAT") {
              return <>{backHtml()}</>;
            }
          }
        }
        break;
      default:
        return <></>;
    }
  };
  //tr??? v??? c???u tr??c html c???a ph???n c???u tr??c m?? voucher d???a theo gi?? tr??? c???a lo???i m??
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
                    disabled={disable.typeCode}
                  />{" "}
                  T??? ?????ng sinh m??
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
                    value="3"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 3 ? true : false}
                    disabled={disable.typeCode}
                  />
                  <i className="input-helper"></i>
                  T??? ?????ng sinh m?? v???i ti???n t???(t???i ??a 4 k?? t???)
                </label>
                <input
                  type="text"
                  id="prefix"
                  style={{ display: displayPrefix }}
                  className="form-control col-md-2"
                  placeholder="ABCD"
                  onChange={(e) =>
                    setData({
                      ...data,
                      prefix: e.target.value
                        .toUpperCase()
                        .replace(/[^\w\s]/gi, ""),
                    })
                  }
                  value={data.prefix}
                  disabled={disable.prefix}
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
                    value="2"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 2 ? true : false}
                    disabled={disable.typeCode}
                  />{" "}
                  Nh???p m?? (8 k?? t???)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    M?? l?? ch??? c??i vi???t hoa ho???c s???
                  </span>
                </label>
                <input
                  type="text"
                  id="manualCode"
                  style={{ display: displayManualCode }}
                  className="form-control col-md-2"
                  placeholder="XYZ12345"
                  onChange={(e) =>
                    setData({
                      ...data,
                      manualCode: e.target.value
                        .toUpperCase()
                        .replace(/[^\w\s]/gi, ""),
                    })
                  }
                  value={data.manualCode}
                  disabled={disable.manualCode}
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
                    disabled={disable.typeCode}
                  />{" "}
                  T??? ?????ng sinh m??
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
                    value="3"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 3 ? true : false}
                    disabled={disable.typeCode}
                  />{" "}
                  T??? ?????ng sinh m?? v???i ti???n t???(t???i ??a 4 k?? t???)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    M?? l?? ch??? c??i vi???t hoa ho???c s???
                  </span>
                </label>
                <input
                  type="text"
                  id="prefix"
                  style={{ display: displayPrefix }}
                  className="form-control col-md-2"
                  placeholder="XYZT"
                  onChange={(e) =>
                    setData({
                      ...data,
                      prefix: e.target.value
                        .toUpperCase()
                        .replace(/[^\w\s]/gi, ""),
                    })
                  }
                  value={data.prefix}
                  disabled={disable.prefix}
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
                    disabled={disable.typeCode}
                  />{" "}
                  T??? ?????ng sinh m??
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
                    value="3"
                    onChange={selectTypeCode}
                    checked={data.typeCode === 3 ? true : false}
                    disabled={disable.typeCode}
                  />{" "}
                  T??? ?????ng sinh m?? v???i ti???n t???(t???i ??a 4 k?? t???)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    M?? l?? ch??? c??i vi???t hoa ho???c s???
                  </span>
                </label>
                <input
                  type="text"
                  id="prefix"
                  style={{ display: displayPrefix }}
                  className="form-control col-md-2"
                  placeholder="XYZT"
                  onChange={(e) =>
                    setData({
                      ...data,
                      prefix: e.target.value
                        .toUpperCase()
                        .replace(/[^\w\s]/gi, ""),
                    })
                  }
                  value={data.prefix}
                  disabled={disable.prefix}
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
  // ???n/hi???n ti??u ch?? ??p d???ng m?? c?? ??i???u ki???n v?? ko c?? ??i???u ki???n
  const showListConditional = () => {
    var yesConditional = document.getElementById("yesConditional");
    var listConditional = document.getElementById("listConditional");
    listConditional.style.display = yesConditional.checked ? "block" : "none";
  };
  // ???n/hi???n select g??i c?????c
  const showListPackage = (e) => {
    setPkStatus((pkStatus = e.target.value));
    setCurentPackageType(e.target.value);
    if (curentPackageType == "ALL") {
      setCurrentTypeArea(0);
    }
    let pk = document.getElementById("pk");
    let multi_select = document.getElementById("multi_select");
    multi_select.style.display = pk.checked ? "block" : "none";
    setCheckedTypeArea((checkedTypeArea = true));
  };
  // disable ph???m vi ??p d???ng m?? theo khu v???c giao v?? khu v???c g???i
  const disableByArea = (e) => {
    let pkTo = document.getElementById("pkTo");
    let pkFrom = document.getElementById("pkFrom");
    pkTo.disabled = true;
    pkFrom.disabled = true;
    setCheckedTypeArea((checkedTypeArea = true));
    setIsSelectedAllPackage(true);
  };
  // undisable ph???m vi ??p d???ng m?? theo khu v???c giao v?? khu v???c g???i
  const unDisableByArea = (e) => {
    let pkTo = document.getElementById("pkTo");
    let pkFrom = document.getElementById("pkFrom");
    let selectByArea = document.getElementById("selectByArea");
    pkTo.disabled = false;
    pkFrom.disabled = false;
    setCheckedTypeArea((checkedTypeArea = true));
    setIsSelectedAllPackage(false);
  };
  //disable/undisable multiselect t???nh th??nh c???a khu v???c giao/khu v???c g???i
  const onClickSetAllArea = () => {
    setDisablePkTo(true);
    setDisablePkFrom(true);
    let multiCheckedTo = document.getElementById("typeArePKTo");
    multiCheckedTo.style.display = "none";
    let multiCheckedFrom = document.getElementById("typeArePKFrom");
    multiCheckedFrom.style.display = "none";
  };
  //disable/undisable multiselect t???nh th??nh theo c???a v???c giao/khu v???c g???i
  const onClickSetTypeAreaTo = () => {
    setDisablePkTo(false);
    setDisablePkFrom(true);
    let multiCheckedTo = document.getElementById("typeArePKTo");
    multiCheckedTo.style.display = "block";
    let multiCheckedFrom = document.getElementById("typeArePKFrom");
    multiCheckedFrom.style.display = "none";
  };
  //disable/undisable multiselect t???nh th??nh c???a khu v???c giao/khu v???c g???i
  const onClickSetTypeAreaFrom = () => {
    setDisablePkTo(true);
    setDisablePkFrom(false);
    let multiCheckedTo = document.getElementById("typeArePKTo");
    multiCheckedTo.style.display = "none";
    let multiCheckedFrom = document.getElementById("typeArePKFrom");
    multiCheckedFrom.style.display = "block";
  };
  //H??m ki???m tra disable theo ??i???u ki???n c???a tr???ng th??i
  const isDisableStatus = (code) => {
    let disableStatus = false;
    var page = id ? "update" : copyFromId ? "copy" : "create";
    if (page != id) {
      //n???u l?? m??n create v?? copy th?? ch??? ???????c ch???n tr???ng th??i l?? ch??? duy???t,c??c tr???ng th??i kh??c b??? disable
      disableStatus = code !== STATUS_WAIT_APPROVE;
    }
    if ((page = id)) {
      //?????T PH??T H??NH H???T H???N
      let curdate = new Date().toJSON().slice(0, 10);
      if (curdate > data.endAt) {
        disableStatus = true;
      } else {
        //?????T PH??T H??NH C??N H???N
        switch (disable.status) {
          case 1:
            //Nh??n vi??n kinh doanh
            if (role == "SALE") {
              disableStatus = code !== STATUS_CANCEL;
            }
            //Tr?????ng ph??ng
            if (role == "MANAGER") {
              disableStatus =
                code !== STATUS_REJECT &&
                code !== STATUS_APPROVED &&
                code !== STATUS_CANCEL;
            }
            //?????i so??t
            if (role == "DOISOAT") {
              disableStatus = true;
            }
            //ADMIN
            if (role == "ADMIN") {
              disableStatus = false;
            }
            break;
          case 2:
            // t??? ch???i duy???t tr???ng th??i ch??? ???????c ?????i sang Ch??? duy???t ho???c H???y
            if (role == "SALE" || role == "MANAGER") {
              disableStatus =
                code !== STATUS_WAIT_APPROVE && code !== STATUS_CANCEL;
            }
            //?????i so??t
            if (role == "DOISOAT") {
              disableStatus = true;
            }
            //ADMIN
            if (role == "ADMIN") {
              disableStatus = false;
            }
            break;
          case 3:
            // ???? duy???t tr???ng th??i ch??? ???????c ?????i sang ???? ph??t h??nh, T???m d???ng, H???y
            if (role == "SALE" || role == "MANAGER") {
              disableStatus =
                code !== STATUS_PUBLISHED &&
                code !== STATUS_PAUSE &&
                code !== STATUS_CANCEL;
            }
            //?????i so??t
            if (role == "DOISOAT") {
              disableStatus = true;
            }
            //ADMIN
            if (role == "ADMIN") {
              disableStatus = false;
            }
            break;
          case 4:
            // ???? ph??t h??nh Tr???ng th??i ?????i sang T???m d???ng, H???y
            if (role == "SALE" || role == "MANAGER") {
              disableStatus = code !== STATUS_PAUSE && code !== STATUS_CANCEL;
            }
            //?????i so??t
            if (role == "DOISOAT") {
              disableStatus = true;
            }
            //ADMIN
            if (role == "ADMIN") {
              disableStatus = false;
            }
            break;
          case 5:
            // t???m d???ng Tr???ng th??i  ???? ph??t h??nh, H???y
            if (role == "SALE" || role == "MANAGER") {
              disableStatus =
                code !== STATUS_PUBLISHED && code !== STATUS_CANCEL;
            }
            //?????i so??t
            if (role == "DOISOAT") {
              disableStatus = true;
            }
            //ADMIN
            if (role == "ADMIN") {
              disableStatus = false;
            }
            break;
          case 6:
            disableStatus = true;
            break;
          default:
            break;
        }
      }
    }
    return disableStatus;
  };

  //h??m update disable value
  const updateDisableValue = (status, dataEndAt) => {
    //?????T PH??T H??NH H???T H???N
    let curdate = new Date().toJSON().slice(0, 10);
    if (curdate > dataEndAt) {
      setDisable({
        ...disable,
        voucherSerialName: true,
        voucherType: true,
        voucherValue: true,
        title: true,
        shortName: true,
        content: true,
        desc: true,
        image: true,
        discountForm: true,
        vouchcerServiceApplication: true,
        discountType: true,
        packages: true,
        startAt: true,
        endAt: true,
        typeArea: true,
        provinceCodeFrom: true,
        provinceCodeTo: true,
        ishared: true,
        usage_limit: true,
        personalUsageLimit: true,
        status: STATUS_EXPIRED,
        paymentMethod: true,
        minValueCodition: true,
        fromDateCondition: true,
        toDateCondition: true,
        userTypeCodition: true,
        sexCondition: true,
        fromAge: true,
        toAge: true,
        maxValue: true,
        baseOnCondition: true,
        durationDayCondition: true,
        prefix: true,
        typeCode: true,
        manualCode: true,
        packageUserCondition: true,
        userPhone: true,
        amountVoucher: true,
        serialUsageLimit: true,
        voucherUsageLimit: true,
      });
    }
    if (curdate < dataEndAt) {
      //?????T PH??T H??NH C??N H???N
      switch (status) {
        case 1:
          //ch??? duy???t ???????c c???p nh???t t???t c??? th??ng tin,?????i so??t ko th??? thay ?????i
          if (role == "DOISOAT") {
            setDisable({
              ...disable,
              voucherSerialName: true,
              voucherType: true,
              voucherValue: true,
              title: true,
              shortName: true,
              content: true,
              desc: true,
              image: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              status: STATUS_WAIT_APPROVE,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }
          break;
        case 2:
          //t??? ch???i duy???t ???????c c???p nh???t t???t c??? th??ng tin,?????i so??t kh??ng th??? thay ?????i
          if (role == "DOISOAT") {
            setDisable({
              ...disable,
              voucherSerialName: true,
              voucherType: true,
              voucherValue: true,
              title: true,
              shortName: true,
              content: true,
              desc: true,
              image: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              status: STATUS_REJECT,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }
          break;
        case 3:
          //???? duy???t ch??? ???????c c???p nh???t T??n ?????t ph??t h??nh, t??n ng???n m?? gi???m gi??, ti??u ?????, n???i dung, m?? t???, ???nh
          if (role == "SALE" || role == "MANAGER") {
            setDisable({
              ...disable,
              voucherType: true,
              voucherValue: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              status: STATUS_APPROVED,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }
          if (role == "DOISOAT") {
            setDisable({
              ...disable,
              voucherSerialName: true,
              voucherType: true,
              voucherValue: true,
              title: true,
              shortName: true,
              content: true,
              desc: true,
              image: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              status: 3,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }

          break;
        case 4:
          //???? ph??t h??nh ch??? ???????c c???p nh???t T??n ?????t ph??t h??nh, t??n ng???n m?? gi???m gi??, ti??u ?????, n???i dung, m?? t???, ???nh
          if (role == "SALE" || role == "MANAGER") {
            setDisable({
              ...disable,
              voucherType: true,
              voucherValue: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              status: STATUS_PUBLISHED,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }
          if (role == "DOISOAT") {
            setDisable({
              ...disable,
              voucherSerialName: true,
              voucherType: true,
              voucherValue: true,
              title: true,
              shortName: true,
              content: true,
              desc: true,
              image: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              status: STATUS_PUBLISHED,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }
          break;
        case 5:
          //t???m d???ng
          if (role != "ADMIN") {
            setDisable({
              ...disable,
              voucherSerialName: true,
              voucherType: true,
              voucherValue: true,
              title: true,
              shortName: true,
              content: true,
              desc: true,
              image: true,
              discountForm: true,
              vouchcerServiceApplication: true,
              discountType: true,
              packages: true,
              startAt: true,
              endAt: true,
              typeArea: true,
              provinceCodeFrom: true,
              provinceCodeTo: true,
              ishared: true,
              usage_limit: true,
              personalUsageLimit: true,
              paymentMethod: true,
              minValueCodition: true,
              fromDateCondition: true,
              toDateCondition: true,
              userTypeCodition: true,
              sexCondition: true,
              fromAge: true,
              toAge: true,
              maxValue: true,
              baseOnCondition: true,
              durationDayCondition: true,
              prefix: true,
              typeCode: true,
              manualCode: true,
              packageUserCondition: true,
              userPhone: true,
              status: STATUS_PAUSE,
              amountVoucher: true,
              serialUsageLimit: true,
              voucherUsageLimit: true,
            });
          }

          break;
        case 6:
          //h???y Kh??ng th??? thay ?????i
          setDisable({
            ...disable,
            voucherSerialName: true,
            voucherType: true,
            voucherValue: true,
            title: true,
            shortName: true,
            content: true,
            desc: true,
            image: true,
            discountForm: true,
            vouchcerServiceApplication: true,
            discountType: true,
            packages: true,
            startAt: true,
            endAt: true,
            typeArea: true,
            provinceCodeFrom: true,
            provinceCodeTo: true,
            ishared: true,
            usage_limit: true,
            personalUsageLimit: true,
            status: STATUS_CANCEL,
            paymentMethod: true,
            minValueCodition: true,
            fromDateCondition: true,
            toDateCondition: true,
            userTypeCodition: true,
            sexCondition: true,
            fromAge: true,
            toAge: true,
            maxValue: true,
            baseOnCondition: true,
            durationDayCondition: true,
            prefix: true,
            typeCode: true,
            manualCode: true,
            packageUserCondition: true,
            userPhone: true,
            amountVoucher: true,
            serialUsageLimit: true,
            voucherUsageLimit: true,
          });
          break;
        default:
          break;
      }
    }
  };
  //===========================END CONFIG DATA ===================================

  //================================== CALL API ===================================

  //api detail voucher_serial
  const axiosGetDetailVoucherSerial = async () => {
    let voucherSerialId = id ? id : copyFromId;
    if (!voucherSerialId) {
      return;
    }
    let response = await getDetailVoucherSerialController(
      voucherSerialId,
      header
    );
    if (response.data && response.status === 200) {
      console.log("data detail", response.data);
      let listUserPhone = [];
      response.data.serialUserMaps.map((item) =>
        listUserPhone.push(item.phone)
      );
      if (listUserPhone != null && listUserPhone.length > 0) {
        let result = [];
        listUserPhone.map((item) => result.push({ value: item, label: item }));
        setSelectedUserId(result);
      }
      if (
        response.data.voucherSerial.typeCode == 2 ||
        response.data.voucherSerial.typeCode == 3
      ) {
        setDisplayManualCode("block");
        setDisplayPrefix("block");
      }

      let provinCodeList = [];
      provinCodeList = response.data.areaCondition.provinceCodes.split(",");
      if (response.data.areaCondition.type == 0) {
        setData({ ...data, provinceCodeTo: [] });
        setData({ ...data, provinceCodeFrom: [] });
      }
      if (response.data.areaCondition.type == 1) {
        setData({
          ...data,
          provinceCodeTo: provinCodeList,
        });
        let multiCheckedTo = document.getElementById("typeArePKTo");
        multiCheckedTo.style.display = "block";
        setDisablePkTo(false);
      }
      if (response.data.areaCondition.type == 2) {
        setData({
          ...data,
          provinceCodeFrom: provinCodeList,
        });
        let multiCheckedFrom = document.getElementById("typeArePKFrom");
        multiCheckedFrom.style.display = "block";
        setDisablePkFrom(false);
      }

      if (response.data.objectCondition.shipPackages.split(",")[0] == "ALL") {
        setCurentPackageType("ALL");
        setCurrentTypeArea(0);
      } else {
        setCurentPackageType("selectPackage");
      }
      if (response.data.objectCondition.shipPackages.split(",")[0] !== "ALL") {
        setIsSelectedAllPackage(false);
        document.getElementById("multi_select").style.display = "block";
        if (
          response.data.objectCondition.shipPackages.split(",").length === 1
        ) {
          // Call get province list api for single package
          const packageCode =
            response.data.objectCondition.shipPackages.split(",")[0];
          // axiosGetListPackageFromProvince(packageCode);
          //CALL API PROVINCECODE
          // axiosGetListPackageToProvince(packageCode);
          // setIsSinglePackage((isSinglePackage = false));
        }
      }
      //====================M??N S???A===================
      if ((voucherSerialId = id)) {
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
          provinceCodeFrom:
            response.data.areaCondition.provinceCodes.split(","),
          ishared: response.data.voucherSerial.isShared,
          voucherUsageLimit: response.data.voucherSerial.voucherUsageLimit,
          serialUsageLimit: response.data.voucherSerial.serialUsageLimit,
          amountVoucher:
            response.data.voucherSerial.serialUsageLimit /
            response.data.voucherSerial.voucherUsageLimit,
          status: response.data.voucherSerial.status,
          paymentMethod: response.data.condition.paymentMethod.split(","),
          minValueCodition: response.data.valueCondition.minValue,
          fromDateCondition: response.data.valueCondition.fromDate,
          toDateCondition: response.data.valueCondition.toDate,
          userTypeCodition: response.data.userCondition.type,
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
          rejectReason:
            response.data.voucherSerial.rejectionReason != null
              ? response.data.voucherSerial.rejectionReason
              : "",
          voucherSerialId: parseInt(id),
        });

        setDisable({ ...disable, status: response.data.voucherSerial.status });
        // setDataEndAt(response.data.voucherSerial.endAt);
        updateDisableValue(
          response.data.voucherSerial.status,
          response.data.voucherSerial.endAt
        );
        if (response.data.voucherSerial.status == 2 || role == "ADMIN") {
          setIsDisableRejectReason(false);
        }
        setIsSinglePackage(false);
        // if (page != id || page != copyFromId) {
        //   //n???u l?? m??n create v?? copy th?? ch??? ???????c ch???n tr???ng th??i l?? ch??? duy???t,c??c tr???ng th??i kh??c b??? disable
        //   setIsSinglePackage(true);
        // }
      }
      //==================END M??N S???A===============

      //===================M??N COPY====================
      if ((voucherSerialId = copyFromId)) {
        //ch??? n??y sau n??y s??? l?? role tr??? v???
        // setRole(response.data.userDetails.role);

        setData({
          ...data,
          voucherSerialName: response.data.voucherSerial.name,
          voucherType: response.data.vapplicable.type,
          voucherValue: response.data.vapplicable.value,
          title: response.data.voucherSerial.title,
          shortName: response.data.voucherSerial.shortName,
          content: response.data.voucherSerial.content,
          desc: response.data.voucherSerial.desc,
          image: "",
          discountForm: response.data.vapplicable.method,
          vouchcerServiceApplication: 1,
          discountType: response.data.vapplicable.applyFor,
          packages: response.data.objectCondition.shipPackages.split(","),
          startAt: response.data.voucherSerial.startAt,
          endAt: response.data.voucherSerial.endAt,
          typeArea: response.data.areaCondition.type,
          provinceCodeTo: response.data.areaCondition.provinceCodes.split(","),
          provinceCodeFrom:
            response.data.areaCondition.provinceCodes.split(","),
          ishared: response.data.voucherSerial.isShared,
          voucherUsageLimit: response.data.voucherSerial.voucherUsageLimit,
          serialUsageLimit: response.data.voucherSerial.serialUsageLimit,
          amountVoucher:
            response.data.voucherSerial.serialUsageLimit /
            response.data.voucherSerial.voucherUsageLimit,
          status: 1,
          paymentMethod: response.data.condition.paymentMethod.split(","),
          minValueCodition: response.data.valueCondition.minValue,
          fromDateCondition: response.data.valueCondition.fromDate,
          toDateCondition: response.data.valueCondition.toDate,
          userTypeCodition: response.data.userCondition.type,
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
          rejectReason: "",
          voucherSerialId: parseInt(id),
        });
        setIsSinglePackage(false);
      }
    } else {
      callNotify("danger", response.message, 3000);
    }
  };
  //api danh s??ch lo???i m?? (voucher/coupon)
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
  //api danh s??ch ng?????i d??ng
  const axiosListUser = async (data) => {
    let result = [];
    let response = await listUserController(data, header);
    if (response.data && response.status === 200) {
      response.data.userList.map((item) =>
        result.push({ value: item.phone, label: item.phone })
      );
      setListUser(result);
    }
  };
  //api danh s??ch d???ch v??? ??p d???ng
  const axiosListServiceApplication = async () => {
    let response = await listServiceApplicationController(header);
    if (response.data && response.status === 200) {
      setListServiceApplication(response.data);
    }
  };
  //api danh s??ch h??nh th???c
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
  //api danh s??ch lo???i ph?? v???n chuy???n
  const axiosListDiscountType = async () => {
    let response = await listDiscountTypeController(header);
    if (response.data && response.status === 200) {
      setListDiscountType(response.data);
    }
  };
  //api danh s??ch tr???ng th??i ?????t ph??t h??nh
  const axiosListVoucherStatus = async () => {
    let response = await listVoucherStatusController(header);
    if (response.data && response.status === 200) {
      setListVoucherStatus(response.data);
    }
  };
  //api ph????ng th???c thanh to??n
  const axiosListPayment = async () => {
    let response = await listPaymentController(header);
    if (response.data && response.status === 200) {
      setListPayment(response.data.paymentMethodList);
    }
  };
  //api danh s??ch g??i c?????c
  const axiosListPackage = async () => {
    let result1 = [];
    let response = await listPackageController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) => {
        let result2 = [];
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
          expanded: true,
        });
      });
      setListPackage(result1);
    }
  };
  //api lo???i m??
  const axiosListCodeType = async () => {
    let result = [];
    let response = await listCodeTypeController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListCodeType(result);
    }
  };
  //api danh s??ch t???nh th??nh
  const axiosGetListProvinceCode = async () => {
    let result = [];
    let response = await getAllProvinceController(header);
    if (response.data && response.status === 200) {
      response.data.list.map((item) =>
        result.push({
          label: item.name,
          value: item.id,
          code: item.code,
        })
      );
      setListProvinceCode(result);
    }
  };

  //===================END CALL API ========================

  //======================== START VALIDATE DATA========================

  const validateAll = () => {
    const msg = {};
    let voucherSerialId = id ? id : copyFromId ? copyFromId : "";
    if (data.paymentMethod !== null && data.paymentMethod.length < 1) {
      msg.paymentMethod = "Vui l??ng ch???n h??nh th???c thanh to??n";
    }
    if (pkStatus == "selectPackage") {
      if (
        data.packages.length == 0 ||
        data.packages[0] == "ALL" ||
        data.packages == null
      ) {
        msg.packages = "Vui l??ng ch???n g??i c?????c";
      }
    }
    if (isEmpty(data.startAt) && isEmpty(data.endAt)) {
      msg.date = "Vui l??ng ch???n kho???ng ng??y";
    }
    //n???u l?? trang create ho???c copy th?? validate ng??y b???t ?????u ph???i l???n h??n ng??y hi???n t???i
    if (voucherSerialId !== id) {
      let curdate = new Date().toJSON().slice(0, 10);
      if (curdate > data.startAt) {
        msg.date = "Ng??y b???t ?????u kh??ng h???p l???";
      }
    }

    if (data.typeArea === 1) {
      // setData({ ...data, provinceCodeFrom: [] });
      if (data.provinceCodeTo.length === 0) {
        msg.provinceCode1 = "Vui l??ng ch???n ?????a ch??? theo khu v???c giao";
      }
    }
    if (data.typeArea === 2) {
      if (data.provinceCodeFrom.length === 0) {
        msg.provinceCode2 = "Vui l??ng ch???n ?????a ch??? theo khu v???c g???i";
      }
    }

    if (
      isEmpty(data.voucherSerialName) ||
      data.voucherSerialName.length >= 255
    ) {
      msg.voucherSerialName = "T??n ?????t ph??t h??nh kh??ng ???????c b??? tr???ng!";
    }
    if (isEmpty(data.shortName) || data.shortName.length >= 255) {
      msg.shortName = "T??n ng???n m?? gi???m gi?? kh??ng ???????c b??? tr???ng!";
    }
    if (isEmpty(data.content) || data.content.length >= 1000) {
      msg.content = "N???i dung m?? gi???m gi?? kh??ng ???????c b??? tr???ng!";
    }
    if (isEmpty(data.title) || data.title.length >= 255) {
      msg.title = "Ti??u ????? m?? gi???m gi?? kh??ng ???????c b??? tr???ng!";
    }
    if (isEmpty(data.desc) || data.desc.length >= 1000) {
      msg.desc = "M?? t??? chi ti???t kh??ng ???????c b??? tr???ng!";
    }
    //Voucher
    if (data.voucherType === 1) {
      if (data.voucherValue == null || isNaN(data.voucherValue)) {
        msg.voucherValue = "M???nh gi?? kh??ng ???????c b??? tr???ng!";
      }
      if (data.voucherValue > 2000000000) {
        msg.voucherValue = "M???nh gi?? kh??ng h???p l???!";
      }
    }
    //Coupon
    if (data.voucherType === 2) {
      if (data.voucherValue === null || isNaN(data.voucherValue)) {
        msg.voucherValue = "Ph???n tr??m kh??ng ???????c b??? tr???ng!";
      }
      if (data.voucherValue == 0 || data.voucherValue > 100) {
        msg.voucherValue = "Gi?? tr??? ph???i > 0 v?? <= 100";
      }
      if (data.maxValue == null || isNaN(data.maxValue)) {
        msg.maxValue = "S??? ti???n t???i ??a kh??ng ???????c b??? tr???ng!";
      }
      if (data.maxValue > 2000000000 || data.maxValue == 0) {
        msg.maxValue = "Gi?? tr??? kh??ng h???p l???!";
      }
    }
    if (data.ishared === null) {
      msg.ishared = "Vui l??ng ch???n lo???i m??";
    }
    //validate c???u tr??c m?? voucher
    if (data.ishared !== null) {
      if (data.typeCode === 0) {
        msg.typeCode = "Vui l??ng ch???n m???t c???u tr??c m?? voucher";
      }
    }
    //validate case lo???i 1 m?? nhi???u ng?????i s??? d???ng
    if (data.ishared === 1) {
      //S??? l???n s??? d???ng t???i ??a c???a ??PH
      if (
        data.serialUsageLimit === null ||
        // data.usage_limit > data.userPhone.length ||
        isNaN(data.serialUsageLimit)
      ) {
        msg.serialUsageLimit = "Kh??ng ???????c b??? tr???ng!";
      }
      if (data.serialUsageLimit > 10000) {
        msg.serialUsageLimit = "Kh??ng h???p l???!";
      }
      //S??? l?????ng t???i ??a cho 1 voucher
      if (
        data.voucherUsageLimit === null ||
        // data.personalUsageLimit > data.userPhone.length ||
        isNaN(data.voucherUsageLimit)
      ) {
        msg.voucherUsageLimit1 = "Kh??ng ???????c b??? tr???ng!";
      }
      if (data.voucherUsageLimit > 10000) {
        msg.voucherUsageLimit1 = "Kh??ng h???p l???!";
      }
      //T??? ?????ng sinh m?? t???i ??a 4 k?? t???

      if (data.typeCode === 3) {
        if (isEmpty(data.prefix)) {
          msg.prefix = "Kh??ng ???????c b??? tr???ng tr?????ng n??y!";
        }
        if (data.prefix.length > 4) {
          msg.prefix = "Kh??ng h???p l???!(T???i ??a 4 k?? t???)";
        }
      }
      //Nh???p m?? 8 k?? t???
      if (data.typeCode === 2) {
        if (isEmpty(data.manualCode)) {
          msg.manualCode = "Kh??ng ???????c b??? tr???ng tr?????ng n??y";
        }
        if (data.manualCode.length != 8) {
          msg.manualCode =
            "Kh??ng h???p l???! Vui l??ng nh???p 8 k?? t??? bao g???m ch??? c??i v?? s???";
        }
      }
    }
    //validate case lo???i m?? y??u c???u nh???p
    if (data.ishared === 2) {
      //Nh???p s??? l?????ng voucher
      if (
        data.amountVoucher === null ||
        data.amountVoucher > 10000 ||
        isNaN(data.amountVoucher)
      ) {
        msg.amountVoucher = "Kh??ng h???p l???!";
      }
      //S??? l?????ng t???i ??a cho 1 user
      if (
        data.voucherUsageLimit === null ||
        data.voucherUsageLimit > 10000 ||
        // data.personalUsageLimit > data.userPhone.length ||
        isNaN(data.voucherUsageLimit)
      ) {
        msg.voucherUsageLimit2 = "Kh??ng h???p l???!";
      }
      //T??? ?????ng sinh m?? t???i ??a 4 k?? t???

      if (data.typeCode === 3) {
        if (isEmpty(data.prefix)) {
          msg.prefix = "Kh??ng ???????c b??? tr???ng tr?????ng n??y!";
        }
        if (data.prefix.length > 4) {
          msg.prefix = "Kh??ng h???p l???!(T???i ??a 4 k?? t???)";
        }
      }
    }
    //validate case lo???i g??n cho t??i kho???n
    if (data.ishared === 3) {
      //validate ch???n danh s??ch user
      if (data.userPhone !== null && data.userPhone.length < 1) {
        msg.userId = "Kh??ng ???????c b??? tr???ng tr?????ng n??y";
      }
      //T??? ?????ng sinh m??
      if (data.typeCode === 3) {
        if (isEmpty(data.prefix)) {
          msg.prefix = "Kh??ng ???????c b??? tr???ng tr?????ng n??y!";
        }
        if (data.prefix.length > 4) {
          msg.prefix = "Kh??ng h???p l???!(T???i ??a 4 k?? t???)";
        }
      }
    }
    if (data.voucherType === null) {
      msg.voucherType = "Vui l??ng ch???n lo???i m??";
    }
    if (data.discountForm === null) {
      msg.discountForm = "Vui l??ng ch???n h??nh th???c";
    }

    if (data.vouchcerServiceApplication === null) {
      msg.vouchcerServiceApplication = "Vui l??ng ch???n d???ch v??? ??p d???ng";
    }
    if (data.paymentMethod === null) {
      msg.paymentMethod = "Vui l??ng ch???n ph????ng th???c thanh to??n";
    }
    if (data.status === null) {
      msg.status = "Vui l??ng ch???n tr???ng th??i";
    }
    if (data.userTypeCodition == null) {
      msg.userTypeCodition = "Vui l??ng ch???n tr???ng th??i g??i c?????c";
    }
    //validate l?? do t??? ch???i duy???t

    //validate n???u ??? m??n s???a v?? tr???ng th??i ??ang ch???n l?? t??? ch???i duy???t
    if (
      (voucherSerialId = id && data.status === 2 && isEmpty(data.rejectReason))
    ) {
      msg.rejectReason = "Vui l??ng nh???p l?? do t??? ch???i";
    }

    setValidationMsg(msg);
    // console.log(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };
  //========================END VALIDATE DATA========================

  //=========================CREATE/COPY===========================
  const onSubmitRelease = async () => {
    console.log("data create", data);
    let params = {
      ...data,
    };
    //config n???u ??ang ch???n t???t c??? g??i c?????c th?? packages="ALL" v?? khu v???c giao s??? l?? to??n b??? h??? th???ng
    if (curentPackageType == "ALL") {
      params.packages = ["ALL"];
      params.typeArea = 0;
    }

    const isValid = validateAll();
    if (!isValid) return;
    //Call API create
    let dataRespon = await createVoucherSerialController(
      header,
      JSON.stringify(params)
    );
    if (dataRespon.status === 200) {
      callNotify("success", "T???o ?????t ph??t h??nh th??nh c??ng", 3000);
      history.push("/listVoucherSerial");
    } else {
      callNotify("danger", dataRespon.message, 3000);
    }
  };
  //=========================END CREATE/COPY===========================

  //=========================UPDATE===========================
  const onSubmitUpdate = async () => {
    let params = {
      ...data,
    };
    //config n???u ??ang ch???n t???t c??? g??i c?????c th?? packages="ALL" v?? khu v???c giao s??? l?? to??n b??? h??? th???ng
    if (curentPackageType == "ALL") {
      params.packages = ["ALL"];
      params.typeArea = 0;
    }
    const isValid = validateAll();
    if (!isValid) return;

    if (params.status === STATUS_APPROVED) {
      //CALL API EDIT
      let dataRespon = await editVoucherSerialController(
        JSON.stringify(params),
        header
      );
      if (dataRespon.status === 200) {
        callNotify("success", "C???p nh???t ?????t ph??t h??nh th??nh c??ng", 3000);
      } else {
        callNotify("danger", dataRespon.message, 3000);
      }
      //CalL API ph??t h??nh voucher
      let dataResponse = await requestRelaseVoucherSerial(
        JSON.stringify(dataRequestReleaseVoucherSerial),
        header
      );
      if (dataResponse.status === 200) {
        callNotify("info", dataResponse.message, 3000);
      } else {
        callNotify("danger", dataResponse.message, 3000);
      }
    } else {
      //Call API update
      let dataRespon = await editVoucherSerialController(
        JSON.stringify(params),
        header
      );
      if (dataRespon.status === 200) {
        callNotify("success", "C???p nh???t ?????t ph??t h??nh th??nh c??ng", 3000);
        history.push("/listVoucherSerial");
      } else {
        callNotify("danger", dataRespon.message, 3000);
      }
    }
  };
  //=========================END UPDATE===========================

  //======================START RENDER========================

  useEffect(() => {
    if (role == "") {
      axiosGetRoleUser();
    }
    if (
      listServiceApplication.length == 0 &&
      ((role != "" && page == "update") || page != "update")
    ) {
      axiosListServiceApplication();
      axiosListDiscountForm();
      axiosListDiscountType();
      axiosListVoucherStatus();
      axiosListPayment();
      axiosListPackage();
      axiosGetListProvinceCode();
      axiosListCodeType();
      axiosListUser();
      axiosListVoucherType();
      axiosGetDetailVoucherSerial();
    }
  }, [id, role]);
  //upload ???nh
  useEffect(() => {
    if (selectedFile !== null) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      formData.append("username", "");
      formData.append("file_type", "");
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
    }
  }, [selectedFile]);
  //selected lo???i(voucher/coupon),h??nh th???c,lo???i m??
  useEffect(() => {
    if (listVoucherType != null && data.voucherType != null) {
      setSelectedVoucherType(
        listVoucherType.filter((item) => item.value === data.voucherType)
      );
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
  //selected g??i c?????c
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
  //selected t???nh th??nh theo khu v???c giao
  useEffect(() => {
    if (
      listProvinceCode != null &&
      listProvinceCode.length > 0 &&
      data.provinceCodeTo != null
    ) {
      setIsSelectedListProvinceTo(
        listProvinceCode.filter(
          (item) => data.provinceCodeTo.indexOf(item.code) > -1
        )
      );
    }
  }, [listProvinceCode, data]);
  //selected t???nh th??nh theo khu v???c g???i
  useEffect(() => {
    if (
      listProvinceCode != null &&
      listProvinceCode.length > 0 &&
      data.provinceCodeFrom != null
    ) {
      setIsSelectedListProvinceFrom(
        listProvinceCode.filter(
          (item) => data.provinceCodeFrom.indexOf(item.code) > -1
        )
      );
    }
  }, [listProvinceCode, data]);
  //selected ng??y b???t ?????u v?? ng??y k???t th??c
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

  //======================END RENDER========================

  return (
    <div className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">ROLE-{role}</h4>
            <h4 className="card-title">Th??m ?????t ph??t h??nh E-voucher</h4>
            <p className="card-description font-weight-bold"> Th??ng tin </p>
            <form className="forms-sample">
              <Form.Group>
                <label htmlFor="exampleInputName1" className="font-weight-bold">
                  T??n ?????t ph??t h??nh(*)
                </label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="voucherSerialName"
                  placeholder="T??n ?????t ph??t h??nh"
                  name="voucherSerialName"
                  onChange={(e) =>
                    setData({ ...data, voucherSerialName: e.target.value })
                  }
                  value={data.voucherSerialName}
                  disabled={disable.voucherSerialName}
                />
                <p className="text-danger">{validationMsg.voucherSerialName}</p>
              </Form.Group>
              <div className="row">
                <div className="form-group col-md-3 pdr-menu edit-card-select">
                  <label htmlFor="voucherType" className="font-weight-bold">
                    Lo???i (*)
                  </label>
                  <Select
                    options={listVoucherType}
                    onChange={selectVoucherType}
                    placeholder="Lo???i m??"
                    value={selectedVoucherType || listVoucherType[0]}
                    isDisabled={disable.voucherType}
                  />
                  <p className="text-danger">{validationMsg.voucherType}</p>
                </div>
                {voucherTypeHtml()}
              </div>
              <div className="row">
                <div className="form-group col-md-4 pdr-menu edit-card-select">
                  <Form.Group>
                    <label htmlFor="shortName" className="font-weight-bold">
                      T??n ng???n m?? gi???m gi?? (*)
                    </label>
                    <Form.Control
                      name="shortName"
                      type="text"
                      className="form-control"
                      id="exampleInputEmail3"
                      placeholder="T??n ng???n m?? gi???m gi??"
                      value={data.shortName}
                      onChange={(e) =>
                        setData({ ...data, shortName: e.target.value })
                      }
                      disabled={disable.shortName}
                    />
                    <p className="text-danger">{validationMsg.shortName}</p>
                  </Form.Group>
                </div>
                <div className="form-group col-md-4 pdr-menu edit-card-select">
                  <Form.Group>
                    <label
                      htmlFor="exampleInputPassword4"
                      className="font-weight-bold"
                    >
                      Ti??u ????? m?? gi???m gi?? (*)
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputPassword4"
                      placeholder="Ti??u ????? m?? gi???m gi??"
                      onChange={(e) =>
                        setData({ ...data, title: e.target.value })
                      }
                      value={data.title}
                      disabled={disable.title}
                    />
                    <p className="text-danger">{validationMsg.title}</p>
                  </Form.Group>
                </div>
              </div>
              <Form.Group>
                <label htmlFor="content" className="font-weight-bold">
                  N???i dung m?? gi???m gi?? (*)
                </label>
                <Form.Control
                  name="content"
                  type="text"
                  className="form-control"
                  id="content"
                  placeholder="N???i dung m?? gi???m gi??"
                  onChange={(e) =>
                    setData({ ...data, content: e.target.value })
                  }
                  value={data.content}
                  disabled={disable.content}
                />
                <p className="text-danger">{validationMsg.content}</p>
              </Form.Group>
              <div className="row">
                <div className="form-group col-md-7 pdr-menu edit-card-select">
                  <Form.Group>
                    <label htmlFor="desc" className="font-weight-bold">
                      M?? t??? chi ti???t (*)
                    </label>
                    <Form.Control
                      name="desc"
                      type="text"
                      className="form-control"
                      id="desc"
                      placeholder="M?? t??? chi ti???t"
                      onChange={(e) =>
                        setData({ ...data, desc: e.target.value })
                      }
                      value={data.desc}
                      disabled={disable.desc}
                    />
                    <p className="text-danger">{validationMsg.desc}</p>
                  </Form.Group>
                </div>
                <div className="form-group col-md-4 pdr-menu edit-card-select">
                  <label htmlFor="" className="font-weight-bold">
                    Th??m ???nh cho chi ti???t
                  </label>
                  <div>
                    <input
                      type="file"
                      onChange={onFileChange}
                      disabled={disable.desc}
                    />
                  </div>
                  {fileData()}
                </div>
              </div>
              <div className="row-fluid">
                <label htmlFor="content " className="font-weight-bold">
                  D???ch v??? ??p d???ng (*)
                </label>
                <div className="col-md-12">
                  <Form.Group>
                    <div className="row">
                      {listServiceApplication.map((item) => (
                        <div
                          className="form-check form-check-primary col-md-4"
                          key={item.code}
                        >
                          <label className="form-check-label">
                            <input
                              name="vouchcerServiceApplication"
                              type="checkbox"
                              key={item.code}
                              className="form-check-input"
                              value={item.code}
                              checked
                              onChange={selectServiceApplication}
                              disabled={disable.vouchcerServiceApplication}
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
              <div className="row">
                <div className="form-group col-md-5  pdr-menu edit-card-select">
                  <label htmlFor="discountForm" className="font-weight-bold">
                    H??nh th???c (*)
                  </label>
                  <Select
                    name="discountForm"
                    id="discountForm"
                    styles={customStyles}
                    options={listDiscountForm}
                    placeholder="H??nh th???c"
                    onChange={selectDiscountForm}
                    value={selectedDiscountForm || listDiscountForm[2]}
                    isDisabled={disable.discountForm}
                  />
                  <p className="text-danger">{validationMsg.discountForm}</p>
                </div>
              </div>

              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block font-weight-bold">
                  D???a tr??n (*)
                </label>
                {listDiscountType.map((item) => (
                  <div className="col-sm-4" key={item.code}>
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
                          disabled={disable.discountType}
                        />{" "}
                        {item.name}
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </div>
                ))}
              </Form.Group>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block font-weight-bold">
                  M???t h??ng ??p d???ng (*)
                </label>
                <div className="col-sm-4">
                  <div className="form-check">
                    <label className="form-check-label ">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="packages"
                        id="allPk"
                        onChange={showListPackage}
                        onClick={disableByArea}
                        value="ALL"
                        checked={isSelectedAllPackage}
                        disabled={disable.packages}
                      />{" "}
                      T???t c??? g??i c?????c
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
                        name="packages"
                        id="pk"
                        onChange={showListPackage}
                        onClick={unDisableByArea}
                        value="selectPackage"
                        checked={!isSelectedAllPackage}
                        disabled={disable.packages}
                      />{" "}
                      G??i c?????c
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
                    components={{ Group }}
                    placeholderButtonLabel="--Ch???n g??i c?????c--"
                    onChange={onChangeSelectPackage}
                    defaultValue={selectedListPackage}
                    isDisabled={disable.packages}
                  />
                  <p className="text-danger">{validationMsg.packages}</p>
                </div>
              </Form.Group>
              <Form.Group className="mt-4 mb-4 row">
                <label className="col-sm-12 col-form-label d-block font-weight-bold">
                  ??p d???ng
                </label>
                <span className="ml-3 mr-3"> Hi???u l???c t???</span>

                <DateRangePicker
                  className="datepicker d-inline-block"
                  onChange={selectDate}
                  value={selectedDateValue}
                  disabled={disable.startAt}
                  disabledDate={beforeToday()}
                />
                <p className="text-danger">{validationMsg.date}</p>
              </Form.Group>
              <Form.Group className="row-fluid">
                <label className="font-weight-bold">
                  Ph???m vi ??p d???ng m?? (*)
                </label>
                <div className="form-check col-md-12">
                  <label className="form-check-label" htmlFor="typeArea_all">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="typeArea"
                      value="0"
                      id="typeArea_all"
                      checked={data.typeArea == 0 ? true : false}
                      onChange={selectTypeArea}
                      onClick={onClickSetAllArea}
                      disabled={disable.typeArea}
                    />
                    <i className="input-helper"></i>
                    To??n b??? h??? th???ng
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
                      disabled={isSinglePackage || disable.typeArea}
                      checked={data.typeArea == 1 ? true : false}
                      onClick={onClickSetTypeAreaTo}
                    />
                    <i className="input-helper"></i>
                    Theo khu v???c giao
                  </label>
                  <div id="typeArePKTo" style={{ display: "none" }}>
                    <ReactMultiSelectCheckboxes
                      id="selectByArea1"
                      options={listProvinceCode}
                      checked={data.typeArea == 2 ? true : false}
                      isDisabled={disablePkTo || disable.typeArea}
                      onChange={selectProvinceTo}
                      defaultValue={isSelectedListProvinceTo}
                      placeholderButtonLabel="--Ch???n t???nh th??nh--"
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
                      disabled={isSinglePackage || disable.typeArea}
                      checked={data.typeArea == 2 ? true : false}
                      onClick={onClickSetTypeAreaFrom}
                    />
                    <i className="input-helper"></i>
                    Theo khu v???c g???i
                  </label>
                  <div id="typeArePKFrom" style={{ display: "none" }}>
                    <ReactMultiSelectCheckboxes
                      id="selectByArea2"
                      options={listProvinceCode}
                      isDisabled={disablePkFrom || disable.typeArea}
                      onChange={selectProvinceFrom}
                      defaultValue={isSelectedListProvinceFrom}
                      placeholderButtonLabel="--Ch???n t???nh th??nh--"
                    />
                  </div>
                  <p className="text-danger">{validationMsg.provinceCode2}</p>
                </div>
              </Form.Group>
              <label className="font-weight-bold">
                Ti??u ch?? ??p d???ng m?? (*)
              </label>
              <Form.Group className="row">
                <div className="form-check col-md-6 ml-3">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="optionsRadios"
                      id="noConditional"
                      checked={data.userTypeCodition === 0 ? true : false}
                      onChange={selectUserTypeCond}
                      value="0"
                      disabled={disable.userTypeCodition}
                    />
                    <i className="input-helper"></i>
                    Kh??ng c?? ??i???u ki???n
                  </label>
                </div>
                <div className="form-check col-md-5">
                  <label
                    className="form-check-label"
                    id="yesConditional"
                    disabled={disable.userTypeCodition}
                  >
                    C?? ??i???u ki???n
                  </label>
                  <p className="text-danger">
                    {validationMsg.userTypeCodition}
                  </p>
                  <ul
                    id="listConditional"
                    className="list-conditional"
                    disabled={disable.userTypeCodition}
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
                            disabled={disable.userTypeCodition}
                            checked={data.userTypeCodition === 1 ? true : false}
                          />
                          <i className="input-helper"></i>
                          Ch??a t???ng l??n ????n c???a t???t c??? g??i c?????c
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
                            disabled={disable.userTypeCodition}
                            checked={data.userTypeCodition === 2 ? true : false}
                          />
                          <i className="input-helper"></i>
                          ???? t???ng l??n ????n c???a t???t c??? g??i c?????c
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Form.Group>
              <div className="row">
                <div className="form-group col-md-4  edit-card-select">
                  <label
                    htmlFor="exampleInputName1"
                    className="font-weight-bold"
                  >
                    Lo???i m?? (*)
                  </label>
                  <Select
                    name="ishared"
                    styles={customStyles}
                    options={listCodeType}
                    placeholder="Ch???n lo???i m??"
                    onChange={selectCodeType}
                    value={selectedCodeType || listCodeType[0]}
                    isDisabled={disable.ishared}
                  />
                  <p className="text-danger">{validationMsg.ishared}</p>
                </div>
                {codeTypeHtml()}
              </div>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block font-weight-bold">
                  C???u tr??c m?? voucher (*)
                </label>
                <p className="text-danger ">{validationMsg.typeCode}</p>
                {codestructureHtml()}
              </Form.Group>
              <div className="row">
                <div className="col-md-12">
                  <label className="font-weight-bold">
                    Ph????ng th???c thanh to??n
                  </label>
                  <Form.Group className="row ml-2">
                    {listPayment.map((item) => (
                      <div
                        className="form-check form-check-primary col-md-4"
                        key={item.code}
                      >
                        <label className="form-check-label">
                          <input
                            name="paymentMethod"
                            id="paymentMethod"
                            type="checkbox"
                            className="form-check-input checkboxPayment"
                            value={item.code}
                            onChange={selectedPaymentMethod}
                            checked={
                              data.paymentMethod.indexOf(item.code + "") > -1
                            }
                            disabled={disable.paymentMethod}
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
                <label className="col-sm-12 col-form-label d-block font-weight-bold">
                  Tr???ng th??i (*)
                </label>
                {listVoucherStatus.map((item) => (
                  <div className="col-sm-2" key={item.code}>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          style={{ display: "none" }}
                          type="radio"
                          className="form-check-input"
                          name="status"
                          onChange={selectStatus}
                          value={item.code}
                          checked={data.status === item.code ? true : false}
                          disabled={isDisableStatus(item.code)}
                        />{" "}
                        {item.name}
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  </div>
                ))}
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label className="font-weight-bold">
                  L?? do t??? ch???i
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={onChangeRejectReason}
                  value={data.rejectReason}
                  disabled={isDisableRejectReason}
                />
              </Form.Group>
              <p className="text-danger">{validationMsg.rejectReason}</p>
              {actionHtml()}
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
          <Button onClick={closeModalNoti}>????ng</Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateVoucher);
