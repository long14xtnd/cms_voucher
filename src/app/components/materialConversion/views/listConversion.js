import React, { useEffect, useState } from "react"
import { listConversionController, activeConversion, editConversionController, exportExcelController, listMaterialsController, getDetailConversion, getAllProductController, getOriginalValuesController, addNewConversionController } from "../controllers/listConversionApi"
import { connect } from "react-redux"
import { saveCustomerInfo } from "../../../../store/actions/AuthAction"
import ReactPagination from "react-paginate"
import Select from "react-select"
import { Store } from 'react-notifications-component'
import { Modal, Button } from "react-bootstrap"
import "../../../../assets/styles/addMaterial.scss"
import "../../materialConversion/style/styleMain.scss"

function ListConversion(props) {
    // ====================== CONFIG STATE ================================ //
    const [listConversion, setlistConversion] = useState([])
    let header = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: props.token,
    }

    let [arrayAddConversiton, setArrayAddConversiton] = useState([])
    let [indexRow, setIndexRow] = useState(1)

    let [request, setRequest] = useState({
        page: 1,
        pagesize: 10,
        keyword: '',
        status: '',
        sortFields: '',
        measure: ''
    })

    let [error, setError] = useState([])

    let [totalRecord, setTotalPage] = useState(0)

    let [dataEdit, setDataEdit] = useState([])
    let [listRowMaterial, setlistRowMaterial] = useState([])

    let [dataMaterialEdit, setDataMaterialEdit] = useState([])
    let [detailConvert, setDetailConvert] = useState([])

    let [showModalEdit, setModalEdit] = useState(false)
    let [showModalAdd, setModalAdd] = useState(false)
    let [allProduct, setAllProduct] = useState([])
    let [originalValues, setOriginalValues] = useState([])

    let [dataCreatConvertion, setDataCreatConvertion] = useState({
        "materialId": 0,
        "measure": "%",
        "value": 0,
        "minValue": 0,
        "status": 1,
        "details": []
    })

    const sortFields = [
        { value: "%", label: "%" },
        { value: "S??? l?????ng", label: "S??? l?????ng" },
    ]

    // ====================== CONFIG STATE ================================ //

    const getlistConversion = async () => {
        let data = await listConversionController(request, header)
        if (data && data.status === 200) {
            setlistConversion(data.data.materialConversions)
            setTotalPage(data.data.numOfRecords / request.pagesize)
        }
    }

    const changePage = (event) => {
        setRequest({ ...request, page: event.selected + 1 })
    }

    const handleSearch = (event) => {
        const { name, value } = event.target
        setRequest({ ...request, [name]: value })
    }

    const handleSearchSelectFields = (event) => {
        setRequest({ ...request, measure: event.value })
    }

    const handleSearchSelectStatus = (event) => {
        setRequest({ ...request, status: event.value })
    }

    const removeDefaulSearch = () => {
        window.location.reload()
    }

    const onCloseAdd = () => {
        setlistRowMaterial([])
        setModalAdd(false)
    }
    const onOpenAdd = () => {
        setArrayAddConversiton([])
        setModalAdd(true)
    }
    const onCloseEdit = () => {
        setModalEdit(false)
    }
    const onOpenEdit = () => {
        setModalEdit(true)
    }

    const editConversion = async (id) => {
        try {
            let detailConversion = await getDetailConversion(id, header)
            if (detailConversion.status === 200) {
                setDataEdit(detailConversion.data)
                setDetailConvert(detailConversion.data.details)
                onOpenEdit()
            } else {
                callNotify('warning', detailConversion.message, 3000)
            }
        } catch (error) {
            callNotify('warning', error, 3000)
        }

    }

    const getAllProduct = async () => {
        let data = await getAllProductController(header)
        try {
            if (data.status === 200) {
                let arrData = []
                data.data.map((item) => {
                    arrData.push({
                        value: item.id,
                        label: item.name,
                    })
                })
                setAllProduct(arrData)
            } else {
                callNotify('danger', data.message, 3000)
            }
        } catch (error) {
            callNotify('warning', error, 3000)
        }
    }

    const getOriginalValues = async () => {
        let data = await getOriginalValuesController(header)
        try {
            if (data.status === 200) {
                let arrData = []
                data.data.originalValues.map((item) => {
                    arrData.push({
                        value: item.code,
                        label: item.name,
                    })
                })
                setOriginalValues(arrData)
            } else {
                callNotify('danger', data.message, 3000)
            }
        } catch (error) {
            callNotify('warning', error, 3000)
        }
    }

    const status = [
        { value: "", label: "T???t c??? tr???ng th??i" },
        { value: "1", label: "Ho???t ?????ng" },
        { value: "0", label: "Kh??ng ho???t ?????ng" },
    ]

    const statusModals = [
        { value: 1, label: "Ho???t ?????ng" },
        { value: 0, label: "Kh??ng ho???t ?????ng" },
    ]

    const updateConversion = async () => {
        let arrDetailProduct = []

        dataEdit.details.map(item => {
            arrDetailProduct.push({
                productId: parseInt(item.productId),
                originalValue: item.originalValue,
                value: parseInt(item.value),
                minValue: parseInt(item.minValue),
                status: 1
            })
        })

        let dataCallApiEdit = {
            materialId: dataEdit.materialId,
            measure: dataEdit.measure,
            value: dataEdit.value,
            minValue: dataEdit.minValue,
            status: dataEdit.status,
            details: arrDetailProduct
        }

        let res = await editConversionController(dataCallApiEdit, header, dataEdit.id)

        if (res.status === 200) {
            callNotify('success', 'S???a c???u h??nh t??? l??? hao h???t th??nh c??ng', 2000)
            onCloseEdit()
            getlistConversion()
        } else {
            callNotify('danger', 'C?? l???i x???y ra trong qu?? tr??nh th???c hi???n', 2000)
        }
    }

    let addNewConversion = async () => {
        // Ch??a th??m s???n ph???m thu???c nguy??n li???u
        let productDetail = ''
        let materialId = ''
        let minValue = ''
        let value = ''
        let validate = 0

        if (arrayAddConversiton.length === 0) {
            productDetail = "Vui l??ng th??m s???n ph???m thu???c nguy??n li???u"
            validate = 1
        }

        if (dataCreatConvertion.materialId === 0) {
            materialId = "Vui l??ng ch???n s???n ph???m"
            validate = 1
        }

        if (dataCreatConvertion.minValue === 0) {
            minValue = "Vui l??ng nh???p gi?? tr??? hao h???t"
            validate = 1
        }

        if (dataCreatConvertion.value === 0) {
            validate = 1
            value = "Vui l??ng nh???p t??? l??? hao h???t cho ph??p"
        }

        setError({
            productDetail: productDetail,
            materialId: materialId,
            minValue: minValue,
            value: value
        })

        arrayAddConversiton.map(item => {
            if (isNaN(item.minValue) === true || item.minValue === '' || item.productId === '' || isNaN(item.value) === true || item.value === '' || isNaN(item.originalValue) === true || item.originalValue === '') {
                validate = 1
                callNotify('info', 'Vui l??ng ki???m tra l???i th??ng tin s???n ph???m thu???c nguy??n li???u', 3000)
            }
        })
        //N???u ???? ??i???n ?????y ????? v?? ????ng th??ng tin
        if (validate === 0) {
            dataCreatConvertion.details = []
            arrayAddConversiton.map(item => {
                dataCreatConvertion.details.push(item)
            })

            let data = await addNewConversionController(dataCreatConvertion, header)

            if (data.status === 200) {
                callNotify('success', 'Th??m m???i c???u h??nh th??nh c??ng', 2000)
            } else {
                callNotify('danger', data.message, 3000)
            }

        }
    }

    const actionStatusConversion = async (id, status) => {
        let data = [
            {
                id: id,
                status: status,
            }
        ]
        let res = await activeConversion(data, header)
        if (res.status === 200) {
            getlistConversion()
            callNotify('success', 'Thay ?????i tr???ng th??i nguy??n li???u th??nh c??ng', 2000)
        }
        else {
            callNotify('danger', res.message, 2000)
        }
    }

    let checkChange = (data, index, type) => {
        let dataProduct = []
        if (type === 'product') {
            dataProduct = {
                productId: data.value,
                index: index,
                originalValue: '',
                minValue: '',
                value: ''
            }
        } else if (type === 'originalValue') {
            dataProduct = {
                originalValue: data.value,
                index: index,
                productId: '',
                minValue: '',
                value: ''
            }
        } else if (type === 'minValue') {
            dataProduct = {
                originalValue: data.target.value,
                index: index,
                productId: '',
                minValue: parseInt(data.target.value),
                value: ''
            }
        } else if (type === 'value') {
            dataProduct = {
                originalValue: '',
                index: index,
                productId: '',
                minValue: '',
                value: parseInt(data.target.value)
            }
        }

        let countCheck = 0

        if (arrayAddConversiton.length === 0) {// N???u m???ng r???ng th?? m???c ?????nh th??m v??o 
            arrayAddConversiton.push(dataProduct)
        } else {
            arrayAddConversiton.map((dataArr) => {
                if (dataArr.index === index) { //n???u c?? index tr??ng  
                    if (type === "product") {
                        dataArr.productId = data.value
                    } else if (type === "originalValue") {
                        dataArr.originalValue = data.value
                    } else if (type === "minValue") {
                        dataArr.minValue = parseInt(data.target.value)
                    } else if (type === "value") {
                        dataArr.value = parseInt(data.target.value)
                    }
                    countCheck = 1
                }
            })
            // N???u s???n ph???m kh??ng c?? trong m???ng th?? th??m s???n ph???m v??o m???ng
            if (countCheck === 0) {
                arrayAddConversiton.push(dataProduct)
            }
        }

        setArrayAddConversiton(arrayAddConversiton)
    }

    let removeRow = (indexRowDel) => {
        // setlistRowMaterial(listRowMaterial.splice(0, 1))
        callNotify('warning', 'T??nh n??ng ??ang ph??t tri???n', 3000)
    }

    let removeRowEdit = (indexRow) => {
        setDetailConvert(detailConvert.filter((item, index) => index !== indexRow))

        let data = dataEdit.details.slice(indexRow)

        setDataEdit({
            ...dataEdit,
            details: data
        })
    }

    let addRowMaterial = () => {
        setError({
            ...error,
            productDetail: ''
        })

        let dataRow = (
            <>
                <div className="row mb-3">
                    <div className="col-3">
                        <Select
                            className="button-select-template"
                            placeholder="T??n nguy??n li???u"
                            options={allProduct}
                            onChange={(data) => checkChange(data, indexRow, 'product')}
                        ></Select>
                    </div>
                    <div className="col-2">
                        <input type="number" className="form-control" placeholder="Gi?? tr???" onKeyUp={(data) => checkChange(data, indexRow, 'value')} />
                    </div>
                    <div className="col-3">
                        <input type="number" className="form-control" placeholder="Gi?? tr???" onKeyUp={(data) => checkChange(data, indexRow, 'minValue')} />
                    </div>

                    <div className="col-4 d-flex align-items-center">
                        <Select
                            className="button-select-template w-75"
                            placeholder="C??ch t??nh"
                            options={originalValues}
                            onChange={(data) => checkChange(data, indexRow, 'originalValue')}
                        ></Select>
                        <div className="w-25 btn-delete-row-modal">
                            <i className="mdi mdi-delete-forever" onClick={() => removeRow(indexRow)}></i>
                        </div>
                    </div>
                </div>
            </>
        )

        setlistRowMaterial([
            ...listRowMaterial,
            dataRow
        ])

        setIndexRow(indexRow + 1)
    }

    let exportExcel = () => {
        callNotify('warning', 'T??nh n??ng ??ang ph??t tri???n', 3000)
        // exportExcelController(request, header)
    }

    let changeDataRowProduct = (value, index, type) => {
        let arrProductEdit = []
        dataEdit.details.map((item, indexItem) => {
            if (indexItem === index) {
                if (type === 'productId') {
                    item.productId = value
                } else if (type === 'value') {
                    item.value = parseInt(value)
                } else if (type === 'minValue') {
                    item.minValue = parseInt(value)
                } else if (type === 'originalValue') {
                    item.originalValue = value
                }
                arrProductEdit.push(item)
            } else {
                arrProductEdit.push(item)
            }
        })

        setDataEdit({
            ...dataEdit,
            details: arrProductEdit
        })
    }

    // success danger info default warning
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
                onScreen: true
            }
        })
    }

    const getMaterial = async () => {
        let dataMate = []
        let dataMaterial = await listMaterialsController(header)
        dataMaterial.data.materials.map((item) => {
            dataMate.push({
                value: item.id,
                label: item.name,
            })
        })
        setDataMaterialEdit(dataMate)
    }

    const addRowProductEditConvertion = () => {

        setDetailConvert(oldArray => [
            ...oldArray,
            {
                minValue: '',
                originalValue: 0,
                productId: 0,
                status: 1,
                value: '',
            }
        ])

        // console.log(dataEdit.details);
        dataEdit.details.push({
            minValue: '',
            originalValue: 0,
            productId: 0,
            status: 1,
            value: '',
        })

    }

    //B???t ?????u v??o m??n s??? ?????c c??c function b??n trong 
    useEffect(() => {
        getlistConversion()
        getMaterial()
        getAllProduct()
        getOriginalValues()
    }, [request])

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h2 className="card-content-title">Danh s??ch c???u h??nh hao h???t nguy??n li???u</h2>

                    <div className="row searchBar">
                        <div className="form-group col-md-3 pdr-menu ">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="T??n nguy??n li???u"
                                name='keyword'
                                onKeyUp={(event) => handleSearch(event)}
                            />
                        </div>

                        <div className="form-group col-md-2 pdr-menu">
                            <Select
                                placeholder="Ch???n ????n v??? chuy???n ?????i"
                                options={sortFields}
                                onChange={(event) => handleSearchSelectFields(event)}
                            />
                        </div>

                        <div className="form-group col-md-2 pdr-menu">
                            <Select
                                placeholder="Ch???n tr???ng th??i"
                                name="status"
                                options={status}
                                onChange={(event) => handleSearchSelectStatus(event)}
                            />
                        </div>
                    </div>
                    <div className="row mgbt searchBar">
                        <div className="form-group col-md-4 pdr-menu">
                            <button
                                type="button"
                                className="btn btn-success btn-icon-text"
                                onClick={() => onOpenAdd()}
                            >
                                <i className="mdi mdi-calendar-plus"></i>
                                <span>Th??m c???u h??nh</span>
                            </button>

                            <button
                                type="submit"
                                className="btn btn-success bth-cancel btn-icon-text ml-2"
                                onClick={() => exportExcel()}
                            >
                                Xu???t Excel
                            </button>
                        </div>
                        <div className="form-group col-md-8 pdl-menu">
                            <div className="d-flex align-items-center justify-content-md-end">
                                <div className="pr-1 mb-3 mb-xl-0">
                                    <button
                                        type="button"
                                        className="btn btn-danger bth-cancel btn-icon-text"
                                        onClick={() => removeDefaulSearch()}
                                    >
                                        B??? l???c
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-custom">
                            <thead>
                                <tr>
                                    <th className="font-weight-bold" width="12%">
                                        Nguy??n li???u/S???n ph???m
                                    </th>
                                    <th className="font-weight-bold" width="12%">Lo???i c???u h??nh</th>
                                    <th className="font-weight-bold" width="8%">
                                        ????n v??? t??nh
                                    </th>
                                    <th className="font-weight-bold" width="8%">
                                        Gi?? tr??? hao h???t
                                    </th>
                                    <th className="font-weight-bold" width="8%">
                                        Hao h???t <br />t??? nhi??n
                                    </th>
                                    <th className="font-weight-bold" width="8%">
                                        Hao h???t <br />hu??? t???i ??a
                                    </th>
                                    <th className="font-weight-bold" width="12%">
                                        Ng??y t???o
                                    </th>
                                    <th className="font-weight-bold" width="12%">
                                        Ng??y c???p nh???t
                                    </th>
                                    <th className="font-weight-bold" width="10%">
                                        Tr???ng th??i
                                    </th>
                                    <th className="font-weight-bold" width="10%">
                                        H??nh ?????ng
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listConversion.map((conversion) => (
                                        <tr key={conversion.id}>
                                            <td className="text-center">{conversion.materialName}</td>
                                            <td></td>
                                            <td className="text-center">{conversion.measure}</td>
                                            <td className="text-center">{conversion.value} {conversion.measure}</td>
                                            <td></td>
                                            <td></td>
                                            <td className="text-center">{conversion.createdDate}</td>
                                            <td className="text-center">{conversion.editedDate}</td>
                                            <td className="text-center">
                                                {conversion.status === 1 ? "Ho???t ?????ng" : "Kh??ng ho???t ?????ng"}
                                            </td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-primary btn-icon-custom"
                                                    onClick={() => editConversion(conversion.id)}>
                                                    <i className="mdi mdi-pen"></i>
                                                </button>

                                                {
                                                    conversion.status === 1 ?
                                                        <button type="button" className="btn btn-danger btn-icon-custom" onClick={() => actionStatusConversion(conversion.id, 0)}>
                                                            <i className="mdi mdi-close-circle-outline"></i>
                                                        </button>
                                                        :
                                                        <button type="button" className="btn btn-success btn-icon-custom" onClick={() => actionStatusConversion(conversion.id, 1)}>
                                                            <i className="mdi mdi-checkbox-marked-circle-outline"></i>
                                                        </button>
                                                }

                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModalAdd} size="xl" onHide={onCloseAdd} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Th??m m???i c???u h??nh hao h???t nguy??n li???u</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-edit-material w-100">
                        <div className="row">
                            <div className="col-6 mt-2">
                                <span className="pb-2">Nguy??n li???u (*)</span>
                                <Select
                                    placeholder="Ch???n nguy??n li???u"
                                    options={dataMaterialEdit}
                                    onChange={(data) => {
                                        setError({
                                            ...error,
                                            materialId: ''
                                        })
                                        setDataCreatConvertion({
                                            ...dataCreatConvertion,
                                            materialId: data.value
                                        })
                                    }}
                                ></Select>
                                <div className="w-100 mt-2 error">{error.materialId} </div>
                            </div>

                            <div className="col-6 mt-2">
                                <span className="pb-2">????n v??? t??nh (*)</span>
                                <Select
                                    onChange={(data) => {
                                        setDataCreatConvertion({
                                            ...dataCreatConvertion,
                                            measure: data.value
                                        })
                                    }}
                                    defaultValue={
                                        sortFields.filter(sortField =>
                                            sortField.value === '%')
                                    }
                                    options={sortFields}
                                />
                            </div>

                            <div className="col-6 mt-2">
                                <span className="pb-2">Gi?? tr??? (*)</span>
                                <input type="number" className="w-100 form-control"
                                    min={0} max={1000}
                                    onKeyUp={(data) => {
                                        if (data.target.value > 100) {
                                            setError({
                                                ...error,
                                                value: 'Gi?? tr??? hao h???t ph???i nh??? h??n 100'
                                            })
                                        }
                                        setError({
                                            ...error,
                                            value: ''
                                        })
                                        setDataCreatConvertion({
                                            ...dataCreatConvertion,
                                            value: data.target.value
                                        })
                                    }}
                                    defaultValue={dataEdit.value} placeholder="Gi?? tr???" />
                                <div className="w-100 mt-2 error">{error.value} </div>
                            </div>

                            <div className="col-6 mt-2">
                                <span className="pb-2">T??? l??? hao h???t cho ph??p (*)</span>
                                <input type="number" className="w-100 form-control" placeholder="Gi?? tr???"
                                    min={0} max={1000}
                                    onKeyUp={(data) => {
                                        setError({
                                            ...error,
                                            minValue: ''
                                        })
                                        setDataCreatConvertion({
                                            ...dataCreatConvertion,
                                            minValue: data.target.value
                                        })
                                    }} />
                                <div className="w-100 mt-2 error">{error.minValue} </div>
                            </div>

                            <div className="col-6 mt-2">
                                <span className="pb-2">Tr???ng th??i (*)</span>
                                <Select
                                    placeholder="Ch???n tr???ng th??i"
                                    name="status"
                                    onChange={(data) => {
                                        setDataCreatConvertion({
                                            ...dataCreatConvertion,
                                            status: data.value
                                        })
                                    }}
                                    defaultValue={
                                        statusModals.filter(statusModal =>
                                            statusModal.value === 1)
                                    }
                                    options={statusModals} />
                            </div>
                        </div>

                        <div className="w-12 mt-3 mb-2 title-body-edit-convestion">
                            <span className="fz-17">
                                <b>S???n ph???m thu???c nguy??n li???u</b>
                            </span>
                            <div className="float-right">
                                <button className="btn add-material" onClick={() => addRowMaterial()}>
                                    <i className="mdi mdi-plus-circle mr-1"></i>
                                    <span>Th??m nguy??n li??u</span>
                                </button>
                            </div>
                        </div>
                        {
                            listRowMaterial.length > 0 &&
                            <div className="row">
                                <div className="col-3">S???n ph???m (*)</div>
                                <div className="col-2">Gi?? tr??? hao h???t (*)</div>
                                <div className="col-3">Gi?? tr??? hao h???t cho ph??p (*)</div>
                                <div className="col-4">C??ch t??nh (*)</div>
                            </div>
                        }
                        <div className="w-100">
                            {
                                listRowMaterial.length > 0 &&
                                listRowMaterial.map(htmlView =>
                                    htmlView
                                )
                            }
                        </div>

                        <div className="w-100 mt-2 error">{error.productDetail} </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onCloseAdd()}>
                        Hu???
                    </Button>
                    <Button variant="primary" onClick={() => addNewConversion()}>
                        Th??m m???i
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalEdit} size="xl" onHide={onCloseEdit} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Ch???nh s???a c???u h??nh</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-edit-material w-100 ">
                        <div className="row">
                            <div className="col-6">
                                <span className="pb-2">T??n nguy??n li???u (*)</span>
                                <Select
                                    isDisabled={true}
                                    placeholder="T??n nguy??n li???u"
                                    defaultValue={
                                        dataMaterialEdit.filter(option =>
                                            option.value === dataEdit.materialId)
                                    }
                                    options={dataMaterialEdit}
                                ></Select>
                            </div>
                            <div className="col-6">
                                <span className="pb-2">Tr???ng th??i (*)</span>
                                <Select
                                    defaultValue={
                                        statusModals.filter(option =>
                                            option.value === dataEdit.status)
                                    }
                                    onChange={(status) => {
                                        setDataEdit({
                                            ...dataEdit,
                                            status: status.value
                                        })
                                    }}
                                    options={statusModals} />
                            </div>
                            <div className="col-6 mt-2">
                                <span className="pb-2">????n v??? t??nh (*)</span>
                                <Select
                                    placeholder="Ch???n ????n v??? chuy???n ?????i"
                                    defaultValue={
                                        sortFields.filter(option =>
                                            option.value === dataEdit.measure)
                                    }
                                    onChange={(sortFields) => {
                                        setDataEdit({
                                            ...dataEdit,
                                            measure: sortFields.value
                                        })
                                    }}
                                    name="measure"
                                    options={sortFields}
                                />
                            </div>
                            <div className="col-6 mt-2">
                                <span className="pb-2">Gi?? tr??? (*)</span>
                                <input type="number" className="w-100 form-control" onKeyUp={
                                    (dataValue) => {
                                        setDataEdit({
                                            ...dataEdit,
                                            value: dataValue.target.value
                                        })
                                    }
                                } defaultValue={dataEdit.value} placeholder="Gi?? tr???" />
                            </div>
                        </div>
                        <div className="w-12 mt-3 mb-2 title-body-edit-convestion">
                            <span className="fz-17">
                                <b>S???n ph???m thu???c nguy??n li???u</b>
                            </span>
                            <div className="float-right">
                                <button className="add-material btn" onClick={() => addRowProductEditConvertion()}>
                                    <i className="mdi mdi-plus-circle mr-1"></i>
                                    <span>Th??m nguy??n li??u</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-100">
                            <div className="row">
                                <div className="col-3">S???n ph???m (*)</div>
                                <div className="col-2">Gi?? tr??? hao h???t (*)</div>
                                <div className="col-3">Gi?? tr??? hao h???t cho ph??p (*)</div>
                                <div className="col-4">C??ch t??nh (*)</div>
                            </div>
                            {
                                detailConvert.length > 0 &&
                                detailConvert.map((item, index) => (
                                    <div className="row" key={item.id}>
                                        <div className="col-3">
                                            <Select
                                                placeholder="T??n nguy??n li???u"
                                                options={allProduct}
                                                defaultValue={
                                                    allProduct.filter(itemDetail =>
                                                        itemDetail.value === item.productId)
                                                }
                                                onChange={data => changeDataRowProduct(data.value, index, 'productId')}
                                            ></Select>
                                        </div>
                                        <div className="col-2">
                                            <input type="number" className="w-100 form-control"
                                                min={0} max={1000}
                                                onKeyUp={data => changeDataRowProduct(data.target.value, index, 'value')}
                                                onChange={data => changeDataRowProduct(data.target.value, index, 'value')}
                                                defaultValue={item.value} placeholder="Gi?? tr??? hao h???t" />
                                        </div>
                                        <div className="col-3">
                                            <input type="number" className="w-100 form-control"
                                                min={0} max={1000}
                                                onKeyUp={data => changeDataRowProduct(data.target.value, index, 'minValue')}
                                                onChange={data => changeDataRowProduct(data.target.value, index, 'minValue')}
                                                defaultValue={item.minValue} placeholder="Gi?? tr??? hao h???t cho ph??p" />
                                        </div>
                                        <div className="col-4 d-flex align-items-center">
                                            <Select
                                                className="w-75"
                                                placeholder="C??ch t??nh"
                                                name="name"
                                                options={originalValues}
                                                defaultValue={
                                                    originalValues.filter(itemDetail =>
                                                        itemDetail.value === item.originalValue)
                                                }
                                                onChange={data => changeDataRowProduct(data.value, index, 'originalValue')}
                                            ></Select>
                                            <div className="w-25 btn-delete-row-modal">
                                                <i className="mdi mdi-delete-forever" onClick={() => removeRowEdit(index)}></i>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCloseEdit}>
                        Hu???
                    </Button>
                    <Button variant="primary" onClick={() => updateConversion()}>
                        Thay ?????i
                    </Button>
                </Modal.Footer>
            </Modal >

            <ReactPagination
                previousLabel={<i className="mdi mdi-arrow-left"></i>}
                nextLabel={<i className="mdi mdi mdi-arrow-right"></i>}
                breakLabel={"..."}
                pageCount={totalRecord}
                marginPagesDisplayed={1}
                pageRangeDisplayed={4}
                containerClassName={"pagination justify-content-center mt-4"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
                onPageChange={changePage}
                pagination={false}
            />
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        token: state.authReducer.detail.token,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        saveCustomerInfo: (data) => dispatch(saveCustomerInfo(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListConversion)
