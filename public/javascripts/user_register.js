/**
 * Created by CoderSong on 17/5/23.
 */

$(document).ready(function () {

  // 返回按钮
  $('#exitBtn').click(function () {
    window.location.href = '/h5/login';
  });

  // 注册按钮
  $('#sureBtn').click(function () {
    //1. 检查表单的完整性
    var flag = true;
    var pwd = $('#password').val() || false;
    var rpwd = $('#repassword').val() || false;
    var username = $('#account').val() || false;

    if (! pwd || ! rpwd || ! username) {
      if (flag) $.toast('请完整填写所有内容！', 'forbidden');
      flag = false;
    }

    if (pwd !== rpwd) {
      if (flag) $.toast('两次的密码不相同！', 'forbidden');
      flag = false;
    }

    if (
      pwd.length > 12
      || pwd.length < 6
      || username.length > 12
      || username.length < 6
    ) {
      if (flag) $.toast('账号和密码的长度至少6位最多12位！', 'forbidden');
      flag = false;
    }

    //2. 表单提交
    if (flag)
      $.ajax({
        url: '/api/user',
        type: 'POST',
        data: {
          username: username,
          password: pwd
        },
        success: function (data) {
          window.location.href = '/h5/login';
        },
        error: function (err) {
          if (err.responseJSON.err === 'The length of username or password error!')
            $.toast('账号和密码的长度至少6位最多12位！', 'forbidden');
          else if (err.responseJSON.err === 'The value of key is exist!')
            $.toast('该用户名已经存在！', 'forbidden');
          else
            $.toast('未知错误！', 'forbidden');
        }
      });
  });
});
