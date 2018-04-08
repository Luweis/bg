/**
 * Created by duyilun on 2017/7/25.
 */

import commonContainer from '../../assets/public/js/common'
var doctorHomePageData = {
    realName: '',
    department: '',
    hospitalName: ''
};

$(function () {
    commonContainer.initModelDlg("#orderForm", 400, 400, 'operationOrderForm.html');
});



function showModal() {
    clearForm();
    $('#doctorName').val(doctorHomePageData.realName);
    $('#depName').val(doctorHomePageData.department);
    $('#hospitalName').val(doctorHomePageData.hospitalName);
    $("#operationModal").modal("show");
}
