import axios from "../../../../axios"

const listConversionController = (data, header) => {
    return axios({
        url: '/materialConversions',
        method: 'get',
        params: {
            page: data.page,
            pagesize: data.pagesize,
            keyword: data.keyword,
            status: data.status,
            sortFields: data.sortFields,
            sortFields: data.sortFields,
            measure: data.measure
        },
        headers: header
    })
}

const activeConversion = (data, header) => {
    return axios({
        url: '/materialConversions/batch',
        method: 'post',
        data: {
            materialConversions: data
        },
        headers: header
    })
}

const editConversionController = (data, header, id) => { 
    return axios({
        url: '/materialConversions/' + id,
        method: 'PATCH',
        data: data,
        headers: header
    })
}

const exportExcelController = (data, header) => {
    axios({
            url: '/Conversion/excel',
            method: 'get',
            params: {
                keyword: data.keyword,
                status: data.status,
                sortFields: data.sortFields
            },
            responseType: 'blob',
            headers: header
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'Danh Sách Nguyên Liệu.xlsx')
            document.body.appendChild(link)
            link.click()
        })
        .catch((error) => console.log(error))
}

const listMaterialsController = (header) => {
    return axios({
        url: '/materials',
        method: 'get',
        params: {
            // page: data.page,
            // pagesize: data.pagesize,
            // keyword: data.keyword,
            // status: data.status,
            // sortFields: data.sortFields,
        },
        headers: header
    })
}

const getDetailConversion = (id, header) => {
    return axios({
        url: '/materialConversions/' + id,
        method: 'get',
        params: {},
        headers: header
    })
}


const getAllProductController = (header) => {
    return axios({
        url: '/products',
        method: 'get',
        params: {},
        headers: header
    })
}

const getOriginalValuesController = (header) => {
    return axios({
        url: '/materialConversions/originalValues',
        method: 'get',
        params: {},
        headers: header
    })
}

const addNewConversionController = (data, header) => { 
    return axios({
        url: '/materialConversions',
        method: 'post',
        data: data,
        headers: header
    })
}

export {
    listConversionController,
    activeConversion,
    editConversionController,
    exportExcelController,
    listMaterialsController,
    getDetailConversion,
    getAllProductController,
    getOriginalValuesController,
    addNewConversionController
}