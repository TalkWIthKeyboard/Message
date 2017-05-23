/**
 * Created by CoderSong on 17/5/23.
 */

$(document).ready(function () {

  // 注册按钮
  $('#register').click(function () {
    window.location.href = '/h5/register';
  });

  // 登录按钮
  $('#login').click(function () {
    var username = $('#account').val() || false;
    var password = $('#password').val() || false;
    if (account && password)
      $.ajax({
        url: '/api/login',
        type: 'POST',
        data: {
          username: username,
          password: password
        },
        success: function (data) {
          window.location.href = '/h5/friend';
        },
        error: function (err) {
          if (err.responseJSON.err === 'Username or password error!')
            $.toast('账号输入有误！', 'forbidden');
          else
            $.toast('未知错误！', 'forbidden');
        }
      });
    else
      $.toast('账号/密码未输入！', 'forbidden');

  });
});
