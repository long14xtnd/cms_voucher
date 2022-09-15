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
        { value: "Số lượng", label: "Số lượng" },
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
        { value: "", label: "Tất cả trạng thái" },
        { value: "1", label: "Hoạt động" },
        { value: "0", label: "Không hoạt động" },
    ]

    const statusModals = [
        { value: 1, label: "Hoạt động" },
        { value: 0, label: "Không hoạt động" },
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
            callNotify('success', 'Sửa cấu hình tỉ lệ hao hụt thành công', 2000)
            onCloseEdit()
            getlistConversion()
        } else {
            callNotify('danger', 'Có lỗi xảy ra trong quá trình thực hiện', 2000)
        }
    }

    let addNewConversion = async () => {
        // Chưa thêm sản phẩm thuộc nguyên liệu
        let productDetail = ''
        let materialId = ''
        let minValue = ''
        let value = ''
        let validate = 0

        if (arrayAddConversiton.length === 0) {
            productDetail = "Vui lòng thêm sản phẩm thuộc nguyên liệu"
            validate = 1
        }

        if (dataCreatConvertion.materialId === 0) {
            materialId = "Vui lòng chọn sản phẩm"
            validate = 1
        }

        if (dataCreatConvertion.minValue === 0) {
            minValue = "Vui lòng nhập giá trị hao hụt"
            validate = 1
        }

        if (dataCreatConvertion.value === 0) {
            validate = 1
            value = "Vui lòng nhập tỉ lệ hao hụt cho phép"
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
                callNotify('info', 'Vui lòng kiểm tra lại thông tin sản phẩm thuộc nguyên liệu', 3000)
            }
        })
        //Nếu đã điền đầy đủ và đúng thông tin
        if (validate === 0) {
            dataCreatConvertion.details = []
            arrayAddConversiton.map(item => {
                dataCreatConvertion.details.push(item)
            })

            let data = await addNewConversionController(dataCreatConvertion, header)

            if (data.status === 200) {
                callNotify('success', 'Thêm mới cấu hình thành công', 2000)
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
            callNotify('success', 'Thay đổi trạng thái nguyên liệu thành công', 2000)
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

        if (arrayAddConversiton.length === 0) {// Nếu mảng rỗng thì mặc định thêm vào 
            arrayAddConversiton.push(dataProduct)
        } else {
            arrayAddConversiton.map((dataArr) => {
                if (dataArr.index === index) { //nếu có index trùng  
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
            // Nếu sản phẩm không có trong mảng thì thêm sản phẩm vào mảng
            if (countCheck === 0) {
                arrayAddConversiton.push(dataProduct)
            }
        }

        setArrayAddConversiton(arrayAddConversiton)
    }

    let removeRow = (indexRowDel) => {
        // setlistRowMaterial(listRowMaterial.splice(0, 1))
        callNotify('warning', 'Tính năng đang phát triển', 3000)
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
                            placeholder="Tên nguyên liệu"
                            options={allProduct}
                            onChange={(data) => checkChange(data, indexRow, 'product')}
                        ></Select>
                    </div>
                    <div className="col-2">
                        <input type="number" className="form-control" placeholder="Giá trị" onKeyUp={(data) => checkChange(data, indexRow, 'value')} />
                    </div>
                    <div className="col-3">
                        <input type="number" className="form-control" placeholder="Giá trị" onKeyUp={(data) => checkChange(data, indexRow, 'minValue')} />
                    </div>

                    <div className="col-4 d-flex align-items-center">
                        <Select
                            className="button-select-template w-75"
                            placeholder="Cách tính"
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
        callNotify('warning', 'Tính năng đang phát triển', 3000)
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
            title: "Thông báo",
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

    //Bắt đầu vào màn sẽ đọc các function bên trong 
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
                    <h2 className="card-content-title">Danh sách cấu hình hao hụt nguyên liệu</h2>

                    <div className="row searchBar">
                        <div className="form-group col-md-3 pdr-menu ">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên nguyên liệu"
                                name='keyword'
                                onKeyUp={(event) => handleSearch(event)}
                            />
                        </div>

                        <div className="form-group col-md-2 pdr-menu">
                            <Select
                                placeholder="Chọn đơn vị chuyển đổi"
                                options={sortFields}
                                onChange={(event) => handleSearchSelectFields(event)}
                            />
                        </div>

                        <div className="form-group col-md-2 pdr-menu">
                            <Select
                                placeholder="Chọn trạng thái"
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
                                <span>Thêm cấu hình</span>
                            </button>

                            <button
                                type="submit"
                                className="btn btn-success bth-cancel btn-icon-text ml-2"
                                onClick={() => exportExcel()}
                            >
                                Xuất Excel
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
                                        Bỏ lọc
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
                                        Nguyên liệu/Sản phẩm
                                    </th>
                                    <th className="font-weight-bold" width="12%">Loại cấu hình</th>
                                    <th className="font-weight-bold" width="8%">
                                        Đơn vị tính
                                    </th>
                                    <th className="font-weight-bold" width="8%">
                                        Giá trị hao hụt
                                    </th>
                                    <th className="font-weight-bold" width="8%">
                                        Hao hụt <br />tự nhiên
                                    </th>
                                    <th className="font-weight-bold" width="8%">
                                        Hao hụt <br />huỷ tối đa
                                    </th>
                                    <th className="font-weight-bold" width="12%">
                                        Ngày tạo
                                    </th>
                                    <th className="font-weight-bold" width="12%">
                                        Ngày cập nhật
                                    </th>
                                    <th className="font-weight-bold" width="10%">
                                        Trạng thái
                                    </th>
                                    <th className="font-weight-bold" width="10%">
                                        Hành động
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
                                                {conversion.status === 1 ? "Hoạt động" : "Không hoạt động"}
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
                    <Modal.Title>Thêm mới cấu hình hao hụt nguyên liệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-edit-material w-100">
                        <div className="row">
                            <div className="col-6 mt-2">
                                <span className="pb-2">Nguyên liệu (*)</span>
                                <Select
                                    placeholder="Chọn nguyên liệu"
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
                                <span className="pb-2">Đơn vị tính (*)</span>
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
                                <span className="pb-2">Giá trị (*)</span>
                                <input type="number" className="w-100 form-control"
                                    min={0} max={1000}
                                    onKeyUp={(data) => {
                                        if (data.target.value > 100) {
                                            setError({
                                                ...error,
                                                value: 'Giá trị hao hụt phải nhỏ hơn 100'
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
                                    defaultValue={dataEdit.value} placeholder="Giá trị" />
                                <div className="w-100 mt-2 error">{error.value} </div>
                            </div>

                            <div className="col-6 mt-2">
                                <span className="pb-2">Tỉ lệ hao hụt cho phép (*)</span>
                                <input type="number" className="w-100 form-control" placeholder="Giá trị"
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
                                <span className="pb-2">Trạng thái (*)</span>
                                <Select
                                    placeholder="Chọn trạng thái"
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
                                <b>Sản phẩm thuộc nguyên liệu</b>
                            </span>
                            <div className="float-right">
                                <button className="btn add-material" onClick={() => addRowMaterial()}>
                                    <i className="mdi mdi-plus-circle mr-1"></i>
                                    <span>Thêm nguyên liêu</span>
                                </button>
                            </div>
                        </div>
                        {
                            listRowMaterial.length > 0 &&
                            <div className="row">
                                <div className="col-3">Sản phẩm (*)</div>
                                <div className="col-2">Giá trị hao hụt (*)</div>
                                <div className="col-3">Giá trị hao hụt cho phép (*)</div>
                                <div className="col-4">Cách tính (*)</div>
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
                        Huỷ
                    </Button>
                    <Button variant="primary" onClick={() => addNewConversion()}>
                        Thêm mới
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalEdit} size="xl" onHide={onCloseEdit} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa cấu hình</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-edit-material w-100 ">
                        <div className="row">
                            <div className="col-6">
                                <span className="pb-2">Tên nguyên liệu (*)</span>
                                <Select
                                    isDisabled={true}
                                    placeholder="Tên nguyên liệu"
                                    defaultValue={
                                        dataMaterialEdit.filter(option =>
                                            option.value === dataEdit.materialId)
                                    }
                                    options={dataMaterialEdit}
                                ></Select>
                            </div>
                            <div className="col-6">
                                <span className="pb-2">Trạng thái (*)</span>
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
                                <span className="pb-2">Đơn vị tính (*)</span>
                                <Select
                                    placeholder="Chọn đơn vị chuyển đổi"
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
                                <span className="pb-2">Giá trị (*)</span>
                                <input type="number" className="w-100 form-control" onKeyUp={
                                    (dataValue) => {
                                        setDataEdit({
                                            ...dataEdit,
                                            value: dataValue.target.value
                                        })
                                    }
                                } defaultValue={dataEdit.value} placeholder="Giá trị" />
                            </div>
                        </div>
                        <div className="w-12 mt-3 mb-2 title-body-edit-convestion">
                            <span className="fz-17">
                                <b>Sản phẩm thuộc nguyên liệu</b>
                            </span>
                            <div className="float-right">
                                <button className="add-material btn" onClick={() => addRowProductEditConvertion()}>
                                    <i className="mdi mdi-plus-circle mr-1"></i>
                                    <span>Thêm nguyên liêu</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-100">
                            <div className="row">
                                <div className="col-3">Sản phẩm (*)</div>
                                <div className="col-2">Giá trị hao hụt (*)</div>
                                <div className="col-3">Giá trị hao hụt cho phép (*)</div>
                                <div className="col-4">Cách tính (*)</div>
                            </div>
                            {
                                detailConvert.length > 0 &&
                                detailConvert.map((item, index) => (
                                    <div className="row" key={item.id}>
                                        <div className="col-3">
                                            <Select
                                                placeholder="Tên nguyên liệu"
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
                                                defaultValue={item.value} placeholder="Giá trị hao hụt" />
                                        </div>
                                        <div className="col-3">
                                            <input type="number" className="w-100 form-control"
                                                min={0} max={1000}
                                                onKeyUp={data => changeDataRowProduct(data.target.value, index, 'minValue')}
                                                onChange={data => changeDataRowProduct(data.target.value, index, 'minValue')}
                                                defaultValue={item.minValue} placeholder="Giá trị hao hụt cho phép" />
                                        </div>
                                        <div className="col-4 d-flex align-items-center">
                                            <Select
                                                className="w-75"
                                                placeholder="Cách tính"
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
                        Huỷ
                    </Button>
                    <Button variant="primary" onClick={() => updateConversion()}>
                        Thay đổi
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
