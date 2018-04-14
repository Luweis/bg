import commonContainer from '../public/js/common'
import env from '../config/env';
var secondCount = 300;
var activeCountDownTimerHandler;
var isCountDown = false;
$(function () {
  $('#operationModal').on('hide.bs.modal', function () {
    clearForm();
    $("#submitButton").attr('disabled', false);
  });

  $('#getVerifyNoButton').on('click', getVerifyNo)

  $('#picBaseUrl_art').bind('change', preview);

  $('#yy-cancel-btn').on('click', hiddenModal);

  $('#submitButton').on('click', ajaxOperationSubmit);

  $('#phoneNo').on('click', onPhoneNoChange);

  $('.yy-must').on('change', resetSubmit);

  $('#yy-upload-btn').on('click', function () {
    $('#picBaseUrl_art').trigger('click')
  });
});

function resetGetVerifyButtonStatus () {
  secondCount = 300;
  clearInterval(activeCountDownTimerHandler);
  $("#getVerifyNoButton").val('获取验证码');
}

function preview(e) {
  let file = e.target;
  resetSubmit();
  var divId = "#preview_big_art";
  $(divId).html('');
  $(divId).show();
  if (!file.files) {
    $(divId).hide();
    return;
  }
  for (var i = 0; i < file.files.length; i++) {
    var reader = new FileReader();
    reader.onload = function (evt) {
      var data = evt.target.result;
      var image = new Image();
      image.src = data;
      $(divId).append('<div  class="img-preview-div"><img src="' + data + '" class="img-preview"/></div>');
    }
    reader.readAsDataURL(file.files[i]);
  }
}

function ajaxOperationSubmit() {
  $("#submitButton").attr('disabled', 'disabled');
  if (!validateForm()) {
    return;
  }
  var urlArray = [];
  var files = $("#picBaseUrl_art").files;
  if (files && files.length > 0) {
    var options = {
      url: env.controllerBaseUrl + "operationOrderController/uploadFile",
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        if (!data.resultBodyObject) {
          alert("图片上传失败请检查服务器!");
          return false;
        }
        urlArray = data.resultBodyObject;
        submitForm(urlArray);
      }
    };
    // 提交表单
    $('#imageForm').ajaxSubmit(options);
  } else {
    submitForm(urlArray);
  }
}

function validateForm() {
  if (!$("#patientName").val()) {
    commonContainer.scrollIntoTargetEle('operationModal', 'patientName');
    $('#patientName').addClass('operationOrder-form-warn');
    $("#submitButton").attr('disabled', false);
    return false;
  }

  if (!$("#phoneNo").val()) {
    commonContainer.scrollIntoTargetEle('operationModal', 'phoneNo');
    $('#phoneNo').addClass('operationOrder-form-warn');
    $("#submitButton").attr('disabled', false);
    return false;
  }

  if (!$("#verifyNo").val()) {
    commonContainer.scrollIntoTargetEle('operationModal', 'verifyNo');
    $('#verifyNo').addClass('operationOrder-form-warn');
    $("#submitButton").attr('disabled', false);
    return false;
  }
  if (!$("#diseaseDiagnosis").val()) {
    commonContainer.scrollIntoTargetEle('operationModal', 'diseaseDiagnosis');
    $('#diseaseDiagnosis').addClass('operationOrder-form-warn');
    $("#submitButton").attr('disabled', false);
    return false;
  }
  return true;
}

function getVerifyNo() {
  if (isCountDown) {
    return false;
  }
  resetSubmit();
  var phoneNo = $("#phoneNo").val();
  let regCheckPhoneNo = new RegExp('^1(3|4|5|7|8)\\d{9}$');
  if (!phoneNo || !regCheckPhoneNo.test(phoneNo)) {
    $("#getVerifyNoButton").val('获取验证码');
    alert("请填写正确的手机号码");
    return false;
  }
  isCountDown = true;
  activeCountDownTimerHandler = setInterval(function () {
    if (secondCount > 0) {
      secondCount--;
      $("#getVerifyNoButton").val(secondCount + '秒可重发');
    } else {
      $("#getVerifyNoButton").val('获取验证码');
    }
  }.bind(this), 1000);
  commonContainer.http({
    data: {phoneNo: phoneNo},
    url: 'operationOrderController/getVerifyNo',
    success: function () {
      alert("验证码已经发送");
    }
  });
}

function clearForm() {
  $("#patientName").val('');
  $("#hospitalName").val('');
  $("#phoneNo").val('');
  $("#depName").val('');
  $("#verifyNo").val('');
  $("#doctorName").val('');
  $("#diseaseDesc").val('');
  $("#diseaseDiagnosis").val('');
  $('.img-preview-div').html('');
  $('#preview_big_art').hide();
  resetGetVerifyButtonStatus();
}

function hiddenModal() {
  clearForm();
  $("#submitButton").attr('disabled', false);
  $('#operationModal').modal('hide');
}

function resetSubmit() {
  $('.operationOrder-form-warn').removeClass('operationOrder-form-warn');
  $("#submitButton").attr('disabled', false);
}

function onPhoneNoChange() {
  resetSubmit();
  resetGetVerifyButtonStatus();
  isCountDown = false;
}

function submitForm(urlArray) {
  var urls = env.controllerBaseUrl + "operationOrderController/commitOperation";
  $.ajax({
    type: "post",
    url: urls,
    data: JSON.stringify({
      resourceUrls: urlArray,
      patientName: $("#patientName").val(),
      phoneNo: $("#phoneNo").val(),
      verifyNo: $("#verifyNo").val(),
      doctorName: $("#doctorName").val(),
      hospitalName: $("#hospitalName").val(),
      depName: $("#depName").val(),
      diseaseDiagnosis: $("#diseaseDiagnosis").val(),
      diseaseDesc: $("#diseaseDesc").val()
    }),
    dataType: "json", /*这句可用可不用，没有影响*/
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      if (data.resultBodyObject.result) {
        clearForm();
        $("#submitButton").attr('disabled', false);
        $("#operationModal").modal("hide");
      }
      alert(data.resultBodyObject.resultMsg);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert(textStatus + errorThrown);
    }
  });
}
