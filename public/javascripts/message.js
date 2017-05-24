/**
 * Created by CoderSong on 17/5/24.
 */

$(document).ready(function () {

  $('.my-textarea').keydown(function (e) {
    if (e.which === 13) {
      var value = $(this).val() || false;
      var id = $(this).attr('data-id');
      if (value) {
        sendMessage(value, id);
      } else {
        $.toast('请先输入内容再发送！', 'forbidden');
      }
    }
  });

  function sendMessage(value, id) {
    $.ajax({
      url: '/api/message',
      type: 'POST',
      data: {
        receiver: id,
        message: value
      },
      success: function (data) {
        window.location.reload();
      },
      error: function (err) {
        $.toast('未知错误！', 'forbidden');
      }
    })
  }

  // 删除消息
  $('.message-delete').click(function () {
    var id = $(this).attr('data-id');
    var url = '/api/message/' + id;
    $.confirm("确认删除该条消息？", function() {
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function (data) {
          if (data.data === 'success!')
            window.location.reload();
        },
        error: function (err) {
          $.toast('未知错误！', 'forbidden');
        }
      })
    });
  })
});