<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE html>
<html lang="zh-cn">
<head>

<meta charset="utf-8" />

<title>main</title>

<meta content="width=device-width, initial-scale=1.0" name="viewport" />

<meta content="" name="description" />

<meta content="" name="author" />

<!-- BEGIN GLOBAL MANDATORY STYLES -->

<link
	href="${pageContext.request.contextPath}/static/media/css/bootstrap.min.css"
	rel="stylesheet" type="text/css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/bootstrap-responsive.min.css"
	rel="stylesheet" type="text/css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/font-awesome.min.css"
	rel="stylesheet" type="text/css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/style-metro.css"
	rel="stylesheet" type="text/css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/style.css"
	rel="stylesheet" type="text/css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/style-responsive.css"
	rel="stylesheet" type="text/css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/default.css"
	rel="stylesheet" type="text/css" id="style_color" />

<link
	href="${pageContext.request.contextPath}/static/media/css/uniform.default.css"
	rel="stylesheet" type="text/css" />

<link rel="stylesheet" type="text/css"
	href="${pageContext.request.contextPath}/static/media/css/datepicker.css" />

<link
	href="${pageContext.request.contextPath}/static/media/css/jquery.fancybox.css"
	rel="stylesheet" />

<link
	href="${pageContext.request.contextPath}/static/media/css/search.css"
	rel="stylesheet" type="text/css" />

<!-- END GLOBAL MANDATORY STYLES -->

<link rel="shortcut icon" href="media/image/favicon.ico" />

</head>

<!-- END HEAD -->

<!-- BEGIN BODY -->

<body class="page-header-fixed">



	<!-- BEGIN CONTAINER -->

	<div class="page-container row-fluid">

		<%@ include file="leftnav.jsp"%>


		<!-- BEGIN PAGE -->

		<div class="page-content">

			<!-- BEGIN SAMPLE PORTLET CONFIGURATION MODAL FORM-->

			<div id="portlet-config" class="modal hide">

				<div class="modal-header">

					<button data-dismiss="modal" class="close" type="button"></button>

					<h3>portlet Settings</h3>

				</div>

				<div class="modal-body">

					<p>Here will be a configuration form</p>

				</div>

			</div>

			<!-- END SAMPLE PORTLET CONFIGURATION MODAL FORM-->

			<!-- BEGIN PAGE CONTAINER-->

			<div class="container-fluid" id="main-content">

				<!-- BEGIN PAGE HEADER-->

				<div class="row-fluid">

					<div class="span12">

						<!-- BEGIN STYLE CUSTOMIZER -->

						<div class="color-panel hidden-phone">

							<div class="color-mode-icons icon-color"></div>

							<div class="color-mode-icons icon-color-close"></div>

							<div class="color-mode">

								<p>THEME COLOR</p>

								<ul class="inline">

									<li class="color-black current color-default"
										data-style="default"></li>

									<li class="color-blue" data-style="blue"></li>

									<li class="color-brown" data-style="brown"></li>

									<li class="color-purple" data-style="purple"></li>

									<li class="color-grey" data-style="grey"></li>

									<li class="color-white color-light" data-style="light"></li>

								</ul>

								<label> <span>Layout</span> <select
									class="layout-option m-wrap small">

										<option value="fluid" selected>Fluid</option>

										<option value="boxed">Boxed</option>

								</select>

								</label> <label> <span>Header</span> <select
									class="header-option m-wrap small">

										<option value="fixed" selected>Fixed</option>

										<option value="default">Default</option>

								</select>

								</label> <label> <span>Sidebar</span> <select
									class="sidebar-option m-wrap small">

										<option value="fixed">Fixed</option>

										<option value="default" selected>Default</option>

								</select>

								</label> <label> <span>Footer</span> <select
									class="footer-option m-wrap small">

										<option value="fixed">Fixed</option>

										<option value="default" selected>Default</option>

								</select>

								</label>

							</div>

						</div>

						<!-- END BEGIN STYLE CUSTOMIZER -->

						<!-- BEGIN PAGE TITLE & BREADCRUMB-->

						<h3 class="page-title">

							Blank Page <small>blank page</small>

						</h3>

						<ul class="breadcrumb">

							<li><i class="icon-home"></i> <a href="index.html">Home</a>

								<i class="icon-angle-right"></i></li>

							<li><a href="#">Layouts</a> <i class="icon-angle-right"></i>

							</li>

							<li><a href="#">Blank Page</a></li>

						</ul>

						<!-- END PAGE TITLE & BREADCRUMB-->

					</div>

				</div>

				<!-- END PAGE HEADER-->

				<!-- BEGIN PAGE CONTENT-->

				<div class="row-fluid" id="pageContent"></div>

				<!-- END PAGE CONTENT-->

			</div>

			<!-- END PAGE CONTAINER-->

		</div>

		<!-- END PAGE -->

	</div>

	<!-- END CONTAINER -->



	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

	<!-- BEGIN CORE PLUGINS -->

	<!--[if lt IE 9]>

	<script src="${pageContext.request.contextPath}/static/media/js/excanvas.min.js"></script>

	<script src="${pageContext.request.contextPath}/static/media/js/respond.min.js"></script>  

	<![endif]-->

	<!-- END CORE PLUGINS -->
	<c:choose>
		<c:when test="${empty min}">
			<script type="text/javascript"
				src="${pageContext.request.contextPath}/static/lib/require.js"></script>
		</c:when>
		<c:otherwise>
			<script type="text/javascript"
				src="${pageContext.request.contextPath}/static/build/mainlibs.js"></script>
		</c:otherwise>
	</c:choose>
	<script type="text/javascript">
		var API = {
			BASE : '${pageContext.request.contextPath}'
		};

		require.config({
			baseUrl : '${pageContext.request.contextPath}/static',
			paths : {
				'text' : 'lib/text${min}',
				'jquery' : 'lib/jquery${min}',
				'jquery-migrate' : 'media/js/jquery-migrate-1.2.1.min',
				'jquery-ui' : 'media/js/jquery-ui-1.10.1.custom.min',
				'jquery.blockui' : 'media/js/jquery.blockui.min',
				'jquery.cookie' : 'media/js/jquery.cookie.min',
				'jquery.uniform' : 'media/js/jquery.uniform.min',
				'underscore' : 'lib/underscore${min}',
				'backbone' : 'lib/backbone${min}',
				'bootstrap' : 'lib/bootstrap${min}',
				'slimscroll' : 'lib/jquery.slimscroll${min}',
				'autocomplete' : 'lib/jquery.autocomplete${min}',
				'pnotify' : 'lib/pnotify${min}',
				'jquery.ui.widget' : 'lib/upload/jquery.ui.widget',
				'fileupload' : 'lib/upload/jquery.fileupload',
				'notify' : 'js/notify',
				'moment' : 'lib/moment${min}',
				'moment.tz' : 'lib/moment.tz${min}',
				'bootstrap-datepicker' : 'media/js/bootstrap-datepicker',
				'jquery.fancybox.pack' : 'media/js/jquery.fancybox.pack',
				'app' : 'media/js/app',
				'allassets' : 'js/allassets'
			},
			shim : {
				'backbone' : {
					deps : [ 'underscore', 'jquery' ]
				},
				'bootstrap' : {
					deps : [ 'jquery', 'jquery-ui' ]
				},
				'jquery.ui.widget' : {
					deps : [ 'jquery' ]
				},
				'jquery-migrate' : {
					deps : [ 'jquery' ]
				},
				'jquery-ui' : {
					deps : [ 'jquery' ]
				},
				'jquery.blockui' : {
					deps : [ 'jquery' ]
				},
				'jquery.cookie' : {
					deps : [ 'jquery' ]
				},
				'jquery.uniform' : {
					deps : [ 'jquery' ]
				},
				'fileupload' : {
					deps : [ 'jquery', 'jquery.ui.widget' ]
				},
				'slimscroll' : {
					deps : [ 'jquery' ]
				},
				'autocomplete' : {
					deps : [ 'jquery' ]
				},
				'pnotify' : {
					deps : [ 'jquery' ]
				},
				'notify' : {
					deps : [ 'jquery', 'pnotify' ]
				},
				'moment.tz' : {
					deps : [ 'moment' ]
				},
				'bootstrap-datepicker' : {
					deps : [ 'bootstrap' ]
				},
				'jquery.fancybox.pack' : {
					deps : [ 'jquery' ]
				},
				'app' : {
					deps : [ 'jquery', 'jquery-migrate', 'jquery-ui',
							'bootstrap', 'slimscroll', 'jquery.blockui',
							'jquery.cookie', 'jquery.uniform' ]
				}
			}
		});
		require([ "js/main${min}" ]);
	</script>
	<script type="text/template" id="pic-list-template">
           <a class="fancybox-button" data-rel="fancybox-button"  href="{{-path}}/static/media/image/image1.jpg"> 
           <img src="{{-path}}/static/media/image/image1.jpg" alt=""> 
           <span><em>600 x 400 - keenthemes.com</em></span>
           </a>	
    </script>
</body>
</html>
