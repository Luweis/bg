import '../../node_modules/swiper/dist/css/swiper.min.css'
import '../css/index.css';
import '../public/css/bootstrap.min.css';
import '../css/consultDoctor.css';
import '../css/operationOrder.css';
import '../css/searchDoctor.css';
import '../css/doctorHomePage.css'
import '../css/common/common.css';
import '../public/js/bootstrap.min';
import '../public/js/jquery.form';
import '../css/articleDetail.css';

$('#doc-search-btn').on('click', function () {
  const search = $('#doc-search-value').val();
  location.href = `./doctor?query=${search}`
});

$('#yy-search-btn').on('click', function () {
  const search = $('#yy-search-value').val();
  location.href = `./doctor-yy?type=surgery&query=${search}`
});








