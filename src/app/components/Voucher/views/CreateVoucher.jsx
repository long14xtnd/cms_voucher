import React, { useState, useEffect } from "react";
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
} from "../controller/VoucherApis";
import { connect } from "react-redux";
import { saveCustomerInfo } from "../../../../store/actions/AuthAction";

function CreateVoucher(props) {
  const [data, setData] = useState({
    voucherSerialName: "",
    voucherType: null,
    voucherValue: null,
    title: "",
    shortName: "",
    content: "",
    desc: "",
    image: "image",
    discountForm: "",
    vouchcerServiceApplication: 1,
    discountType: null,
    packages: [],
    startAt: "2022-03-20",
    endAt: "2022-05-24",
    typeArea: 2,
    provinceCode: [],
    ishared: 1,
    usage_limit: "",
    personalUsageLimit: "",
    status: 2,
    paymentMethod: 1,
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
    typeCode: 3,
    manualCode: "",
    packageUserCondition: [],
  });
  const [isCheckedServiceAppliaction, setCheckedServiceApplication] =
    useState(true);
  const [isCheckedPaymentMethod, setCheckedPaymentMethod] = useState(true);
  let [isSinglePackage, setIsSinglePackage] = useState(false);
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
  const [packageIDFromProvince, setListFromProvinceByPackageID] = useState();
  const [packageIDToProvince, setListToProvinceByPackageID] = useState();
  const [listCodeType, setListCodeType] = useState([]);
  const [validationMsg, setValidationMsg] = useState("");

  //========================CONFIG DATA========================
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
    setData({
      ...data,
      startAt: formatDate(selectedDate[0]),
      endAt: formatDate(selectedDate[1]),
    });
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

  const axiosListVoucherType = async () => {
    let result = [];
    let response = await listVoucherTypeController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListVoucherType(result);
    }
  };
  const axiosListUser = async () => {
    let result = [];
    let response = await listUserController(header);
    if (response.data && response.status === 200) {
      response.data.map((item) =>
        result.push({ value: item.id, label: item.name })
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
      // console.log(response.data.paymentMethodList);
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
      response.data.map((item) =>
        result.push({ value: item.code, label: item.name })
      );
      setListCodeType(result);
    }
  };
  const [a, setA] = useState();
  const selectVoucherType = (selectedVoucherType) => {
    setData({ ...data, voucherType: selectedVoucherType.value });
    setA(selectedVoucherType.value);
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
  const selectPaymentMethod = (selectedPaymentMethod) => {
    setCheckedPaymentMethod(false);
    setData({
      ...data,
      paymentMethod: parseInt(selectedPaymentMethod.target.value),
    });
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
  const axiosGetListPackageFromProvince = async (packageId) => {
    let result = [];
    let response = await listFromProvinceController(packageId, header);
    if (response.data && response.status === 200) {
      response.data.list.map((item) =>
        result.push({
          label: item.name,
          value: item.id,
        })
      );
      setListFromProvinceByPackageID(result);
    }
  };

  const axiosGetListPackageToProvince = async (packageId) => {
    let result = [];
    let response = await listToProvinceController(packageId, header);
    if (response.data && response.status === 200) {
      response.data.list.map((item) =>
        result.push({
          label: item.name,
          value: item.id,
        })
      );

      setListToProvinceByPackageID(result);
    }
  };

  const onChangeSelectPackage = (event) => {
    console.log(event);
    if (event.length === 1) {
      // Call get province list api for single package

      const packageId = event[0].value;
      axiosGetListPackageFromProvince(packageId);
      axiosGetListPackageToProvince(packageId);
      setIsSinglePackage((isSinglePackage = false));
      setData({ ...data, packages: [event[0].value] });
    } else if (event.length > 1) {
      console.log(checkedTypeArea);
      setCheckedTypeArea((checkedTypeArea = true));
      openModalNoti(
        "Lỗi !",
        "Không thể lựa chọn nhiều gói cước với khu vực áp dụng xác định, chọn khu vực áp dụng Toàn hệ thống để lựa chọn thêm gói cước khác"
      );
      setIsSinglePackage((isSinglePackage = true));
      let selecttedPackage = [];
      event.map(
        (item) => (selecttedPackage = [...selecttedPackage, item.value])
      );
      setData({
        ...data,
        packages: selecttedPackage,
      });
    }
  };
  const selectProvince = (selectedProvince) => {
    if (selectedProvince.length === 1) {
      setData({ ...data, provinceCode: [selectedProvince[0].value] });
    } else if (selectedProvince.length > 1) {
      let listSelectedProvinces = [];
      selectedProvince.map(
        (item) =>
          (listSelectedProvinces = [...listSelectedProvinces, item.value])
      );
      setData({
        ...data,
        provinceCode: listSelectedProvinces,
      });
    }
  };
  const selectPackageUserCondition = (selectedPackageUserCondition) => {
    if (selectedPackageUserCondition.length === 1) {
      setData({
        ...data,
        packageUserCondition: [selectedPackageUserCondition[0].value],
      });
    } else if (selectedPackageUserCondition.length > 1) {
      let listSelectedPackageUserConditions = [];
      selectedPackageUserCondition.map(
        (item) =>
          (listSelectedPackageUserConditions = [
            ...listSelectedPackageUserConditions,
            item.value,
          ])
      );
      setData({
        ...data,
        packageUserCondition: listSelectedPackageUserConditions,
      });
    }
  };
  const voucherTypeHtml = () => {
    switch (a) {
      case 1:
        return (
          <div className="form-group col-md-3 pdr-menu">
            <label htmlFor="exampleInputName1">Mệnh giá VNĐ (*)</label>
            <input
              type="text"
              className="form-control"
              placeholder="20,000vnđ"
              onChange={(e) =>
                setData({ ...data, voucherValue: e.target.value })
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
                type="text"
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
                    type="text"
                    className="form-control"
                    placeholder="100,000đ"
                    name="maxValue"
                    onChange={(e) =>
                      setData({ ...data, maxValue: e.target.value })
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
        return (
          <></>
          // <div className="form-group col-md-3 pdr-menu">
          //   <label htmlFor="exampleInputName1">Mệnh giá VNĐ (*)</label>
          //   <input
          //     type="text"
          //     className="form-control"
          //     placeholder="20,000vnđ"
          //   />
          // </div>
        );
    }
  };

  const [b, setB] = useState();
  const selectCodeType = (selectedCodeType) => {
    setData({ ...data, ishared: selectedCodeType.value });
    setB(selectedCodeType.value);
  };

  const codeTypeHtml = () => {
    switch (b) {
      case 1:
        return (
          <>
            <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số lần sử dụng tối đa (*)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="100"
                onChange={(e) =>
                  setData({ ...data, usage_limit: e.target.value })
                }
                value={data.usage_limit}
                // value={data.usage_limit}
              />
              <p className="text-danger">{validationMsg.usage_limit}</p>
            </div>
            <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số lượng tối đa cho 1 user (*)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="1"
                onChange={(e) =>
                  setData({
                    ...data,
                    personalUsageLimit: e.target.value,
                  })
                }
                value={data.personalUsageLimit}
              />
              <p className="text-danger">{validationMsg.personalUsageLimit}</p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group col-md-3 pdr-menu">
              <label htmlFor="exampleInputName1">Nhập số lượng mã (*)</label>
              <input
                type="text"
                className="form-control"
                placeholder="100"
                onChange={(e) =>
                  setData({ ...data, usage_limit: e.target.value })
                }
                value={data.usage_limit}
              />
              <p className="text-danger">{validationMsg.usage_limit}</p>
            </div>
            <div className="form-group col-md-6 pdr-menu">
              <label htmlFor="exampleInputName1">Số lần sử dụng 1 mã(*)</label>
              <div className="row">
                <div className="form-group col-md-4 pdr-menu">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1"
                    onChange={(e) =>
                      setData({ ...data, personalUsageLimit: e.target.value })
                    }
                    value={data.personalUsageLimit}
                  />
                  <p className="text-danger">
                    {validationMsg.personalUsageLimit}
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group col-md-8 pdr-menu">
              <label htmlFor="exampleInputName1">Chọn danh sách user (*)</label>
              <Select
                options={listUser}
                placeholder="Chọn"
                closeMenuOnSelect={true}
                components={animatedComponents}
                isMulti
              />
            </div>
          </>
        );
      default:
        return (
          <>
            {/* <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số lượng sử dụng tối đa (*)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="20,000vnđ"
              />
            </div>
            <div className="form-group col-md-4 pdr-menu">
              <label htmlFor="exampleInputName1">
                Số lần sử dụng tối đa trên 1 user: mặc định là 1 (*)
              </label>
              <input type="text" className="form-control" placeholder="1" />
            </div> */}
          </>
        );
    }
  };

  const codestructureHtml = () => {
    switch (b) {
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
                    // value={(data.typeCode = 1)}
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
                  placeholder="XYZ12345"
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
                  placeholder="XYZ12345"
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
        return (
          <>
            {/* <div className="col-sm-12">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="voucherCode"
                    id={`membershipRadios`}
                    // value={(data.typeCode = 1)}
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
                    value="option3"
                  />
                  <i className="input-helper"></i>
                  Tự động sinh mã(tối đa 4 ký tự)
                </label>
                <input
                  type="text"
                  className="form-control col-md-2"
                  placeholder="100"
                />
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
                  />{" "}
                  Nhập mã (8 ký tự)
                  <i className="input-helper"></i>
                  <span className="text-muted d-block">
                    Mã là chữ cái viết hoa hoặc số
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control col-md-2"
                  placeholder="XYZ12345"
                />
              </div>
            </div> */}
          </>
        );
    }
  };
  //show hide tiêu chí áp dụng mã có điều kiện và ko có điều kiện
  const showListConditional = () => {
    var yesConditional = document.getElementById("yesConditional");
    var listConditional = document.getElementById("listConditional");
    listConditional.style.display = yesConditional.checked ? "block" : "none";
  };
  //show/hide gói cước
  const showListPackage = () => {
    let pk = document.getElementById("pk");
    let multi_select = document.getElementById("multi_select");
    multi_select.style.display = pk.checked ? "block" : "none";
    setCheckedTypeArea((checkedTypeArea = true));
  };
  const disableByArea = () => {
    let pkTo = document.getElementById("pkTo");
    let pkFrom = document.getElementById("pkFrom");
    pkTo.disabled = true;
    pkFrom.disabled = true;
    setCheckedTypeArea((checkedTypeArea = true));
  };
  const unDisableByArea = () => {
    let pkTo = document.getElementById("pkTo");
    let pkFrom = document.getElementById("pkFrom");
    let selectByArea = document.getElementById("selectByArea");
    pkTo.disabled = false;
    pkFrom.disabled = false;
    setCheckedTypeArea((checkedTypeArea = true));
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

  //========================END CONFIG DATA========================

  //========================VALIDATE DATA========================

  // const onChangeVoucherSerialName = (event) => {
  //   const value = event.target.value;
  //   setVoucherSerialName(value);
  // };

  const validateAll = () => {
    const msg = {};
    if (isEmpty(data.voucherSerialName)) {
      msg.voucherSerialName = "Vui lòng điền tên đợt phát hành";
    }
    if (isEmpty(data.shortName)) {
      msg.shortName = "Vui lòng điền tên ngắn mã giảm giá";
    }
    if (isEmpty(data.content)) {
      msg.content = "Vui lòng điền nội dung mã giảm giá";
    }
    if (isEmpty(data.title)) {
      msg.title = "Vui lòng điền Tiêu đề mã giảm giá";
    }
    if (isEmpty(data.desc)) {
      msg.desc = "Vui lòng điền mô tả chi tiết mã giảm giá";
    }
    if (isEmpty(data.voucherValue)) {
      msg.voucherValue = "Không được bỏ trống trường này";
    }
    if (isEmpty(data.maxValue)) {
      msg.maxValue = "Vui lòng nhập số tiền áp dụng tối đa";
    }
    if (isEmpty(data.usage_limit)) {
      msg.usage_limit = "Không được bỏ trống trường này";
    }
    if (isEmpty(data.personalUsageLimit)) {
      msg.personalUsageLimit = "Không được bỏ trống trường này";
    }
    if (isEmpty(data.durationDayCondition)) {
      msg.durationDayCondition = "Vui lòng nhập số ngày";
    }
    if (isEmpty(data.minValueCodition)) {
      msg.minValueCodition = "Vui lòng nhập giá trị tiêu dùng tối thiểu";
    }
    if (isEmpty(data.prefix)) {
      msg.prefix = "Không được bỏ trống trường này";
    } else if (data.prefix.length > 4) {
      msg.prefix = "Không được nhập quá 4 kí tự";
    }
    if (isEmpty(data.manualCode)) {
      msg.manualCode = "Không được bỏ trống trường này";
    } else if (data.manualCode.length > 8) {
      msg.manualCode = "Không được nhập quá 8 kí tự";
    }
    if (data.voucherType === null) {
      msg.voucherType = "Vui lòng chọn loại mã";
    }
    if (data.discountForm === null) {
      msg.discountForm = "Vui lòng chọn hình thức";
    }
    if (data.ishared === null) {
      msg.ishared = "Vui lòng chọn loại mã";
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

    setValidationMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };
  const onSubmitRelease = () => {
    console.log(data);
    // const isValid = validateAll();
    // if (!isValid) return;

    //Call API login

    // const postData = {
    //   voucherSerialName: "ten cua dot phat hanh nay",
    //   voucherType: 2,
    //   voucherValue: 100000,
    //   title: "Voucher title",
    //   shortName: " ShortName",
    //   content: " content cua dot phat hanh nay",
    //   desc: "description cua dot phat hanh nay ",
    //   image: "image",
    //   discountForm: 2,
    //   vouchcerServiceApplication: 2,
    //   discountType: 1,
    //   packages: ["64", "62"],
    //   startAt: "2022-11-03",
    //   endAt: "2022-11-19",
    //   typeArea: 2,
    //   provinceCode: ["HNI", "HCM"],
    //   ishared: 1,
    //   usage_limit: 500,
    //   personalUsageLimit: 4,
    //   status: 2,
    //   paymentMethod: 1,
    //   minValueCodition: 2000,
    //   fromDateCondition: "2022-11-03",
    //   toDateCondition: "2022-12-03",
    //   userTypeCodition: 3,
    //   sexCondition: 2,
    //   fromAge: 14,
    //   toAge: 30,
    //   maxValue: 2500000,
    //   baseOnCondition: 1,
    //   durationDayCondition: 4,
    //   prefix: "KHSE",
    //   typeCode: 3,
    //   manualCode: "",
    //   packageUserCondition: [49],
    // };
    console.log("postdata: " + JSON.stringify(data));
    const res = createVoucherSerialController(header, data);
    console.log("res: " + JSON.stringify(res));
  };

  //========================END VALIDATE DATA========================

  useEffect(() => {
    axiosListVoucherType();
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
  }, []);

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
                    name="voucherType"
                    id="discountForm"
                    styles={customStyles}
                    options={listVoucherType}
                    onChange={selectVoucherType}
                    placeholder="Loại"
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
                  <Form.Group>
                    <label>Thêm ảnh cho chi tiết</label>
                    <div className="custom-file">
                      <Form.Control
                        type="file"
                        className="form-control visibility-hidden"
                        id="customFileLang"
                        lang="es"
                        // value={data.image}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="customFileLang"
                      >
                        Upload image
                      </label>
                    </div>
                  </Form.Group>
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
                    // value={(data.discountForm = listDiscountForm.code)}
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
                          defaultChecked={item.code === 2 ? true : false}
                          onChange={selectDiscountType}
                          value={item.code}
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
                        name="ExampleRadio5"
                        id="allPk"
                        onChange={showListPackage}
                        onClick={disableByArea}
                        defaultChecked={true}
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
                    // value={(data.packages = listPackage.list.id)}
                  />
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
                  // value=""
                />
              </Form.Group>
              <Form.Group className="row-fluid">
                <h6>Phạm vi áp dụng mã (*)</h6>
                <div className="form-check col-md-12">
                  <label className="form-check-label" htmlFor="typeArea_all">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="typeArea"
                      value={0}
                      id="typeArea_all"
                      checked={checkedTypeArea}
                      defaultChecked={true}
                      onChange={selectTypeArea}
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
                      value={1}
                      onChange={selectTypeArea}
                      disabled={isSinglePackage}
                    />
                    <i className="input-helper"></i>
                    Theo khu vực giao
                  </label>
                  <ReactMultiSelectCheckboxes
                    id="selectByArea1"
                    options={packageIDFromProvince}
                    isDisabled={isSinglePackage}
                    onChange={selectProvince}
                    // value={(data.provinceCode = packageIDToProvince)}
                  />
                </div>
                <div className="form-check radio-select">
                  <label className="form-check-label" htmlFor="pkFrom">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="typeArea"
                      id="pkFrom"
                      value={2}
                      onChange={selectTypeArea}
                      disabled={isSinglePackage}
                    />
                    <i className="input-helper"></i>
                    Theo khu vực gửi
                  </label>
                  <ReactMultiSelectCheckboxes
                    id="selectByArea2"
                    options={packageIDToProvince}
                    isDisabled={isSinglePackage}
                    onChange={selectProvince}
                  />
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
                    <li>
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
                          type="text"
                          className="form-control"
                          onChange={(e) =>
                            setData({
                              ...data,
                              minValueCodition: e.target.value,
                            })
                          }
                          value={data.minValueCodition}
                        />
                        <p className="text-danger">
                          {validationMsg.minValueCodition}
                        </p>
                        VNĐ Trong
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) =>
                            setData({
                              ...data,
                              durationDayCondition: e.target.value,
                            })
                          }
                          value={data.durationDayCondition}
                        />
                        <p className="text-danger">
                          {validationMsg.durationDayCondition}
                        </p>
                        Ngày
                      </div>
                    </li>
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
                    // onBlur={selectCodeType}
                    // value={(data.ishared = listCodeType.code)}
                  />
                  <p className="text-danger">{validationMsg.ishared}</p>
                </div>
                {codeTypeHtml()}
              </div>
              <Form.Group className="row">
                <label className="col-sm-12 col-form-label d-block">
                  Cấu trúc mã voucher (*)
                </label>
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
                            className="form-check-input"
                            value={item.code}
                            onChange={selectPaymentMethod}
                            checked
                            // defaultChecked={isCheckedPaymentMethod}
                            // checked={item.code===1?true:false}
                            // value={(data.paymentMethod = item.code)}
                          />{" "}
                          {item.name}
                          <i className="input-helper"></i>
                        </label>
                        <p className="text-danger">
                          {validationMsg.paymentMethod}
                        </p>
                      </div>
                    ))}
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
                          defaultChecked={item.code === 1 ? true : false}
                          disabled={
                            item.code === 2 ||
                            item.code === 3 ||
                            item.code === 4 ||
                            item.code === 5
                              ? true
                              : false
                          }
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
                disabled={true}
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateVoucher);
