/**
 * Created by CoderSong on 17/5/23.
 */

$(document).ready(function () {

  // 1. 输入框回车事件
  $('#mov_input').keydown(function (e) {
    if (e.which === 13) {
      var value = $(this).val() || false;
      if (value) {
        $('.search-out').empty();
        $('#select').slideDown();
        searchEvent(value);
      } else {
        $('.search-out').empty();
        $('#select').slideUp();
      }
    }
  });

  // 2. 搜索事件
  function searchEvent(value) {
    let url = '/api/friend/' + value;
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        'friend': value
      },
      success: function (data) {
        var friend = data.data;
        var appendString = '';

        if (friend) {
          appendString += '<div class="weui_media_box weui_media_appmsg"> \
                            <div class="weui_media_hd"> \
                                <img class="weui_media_appmsg_thumb head-image" src="/images/basic_photo.jpg"> \
                            </div> \
                            <div class="weui_media_bd"> \
                                <div class="weui_media_title"> \
                                    <div>' + friend.user.username + '</div> \
                                </div> \
                            </div>';

          if (friend.friend == 2)
            appendString +=
              '   <div class="weui_cell_ft"> \
                      <h4 class="me">我</h4>\
                  </div>\
              </div>';
          else
            if (friend.friend == 0)
              appendString +=
                '   <div class="weui_cell_ft">\
                        <img data-id="' + friend.user.id + '" class="friends-add-btn" src="/images/friends_add.png"/> \
                    </div>\
                  </div>';
             else
              appendString +=
                '   <div class="weui_cell_ft">\
                        <img data-id="' + friend.user.id + '" class="friends-delete-btn" src="/images/friends_delete.png"/> \
                    </div>\
                </div>';



          $('.search-out').append(
            appendString
          );

          // 添加朋友
          $('.friends-add-btn').click(function () {
            var id = $(this).attr('data-id');
            $.ajax({
              url: '/api/friend',
              type: 'POST',
              data: {
                friend: id
              },
              success: function (data) {
                if (data.data == 'success!')
                  window.location.href = '/h5/friend';
                else
                  $.toast('添加好友失败！', 'forbidden');

              }
            });
          });

          // 删除朋友
          $('.friends-delete-btn').click(function () {
            var id = $(this).attr('data-id');
            var url = '/api/friend/' + id;
            $.ajax({
              url: url,
              type: 'DELETE',
              success: function (data) {
                if (data.data == 'success!')
                  window.location.href = '/h5/friend';
                else
                  $.toast('删除好友失败！', 'forbidden');

              }
            });
          });
        } else
          $.toast('没有搜索到结果！', 'forbidden');

      },
      error: function (err) {
        $.toast('未知错误！', 'forbidden');
      }
    });
  }
});
