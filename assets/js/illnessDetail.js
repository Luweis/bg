
const btn = $('.bg-na-dis>a').on('click', (e) =>{
  $(e.target).addClass('active').siblings().removeClass('active');
  const index = $(e.target).attr('data-index');
  const current = $('.bg-dis-content>div').eq(index);
  current.addClass('show').removeClass('hide');
  current.siblings().addClass('hide').removeClass('show');
});


