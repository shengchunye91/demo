<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
		<!-- BEGIN SIDEBAR -->

		<div class="page-sidebar nav-collapse collapse">

			<!-- BEGIN SIDEBAR MENU -->        

			<ul class="page-sidebar-menu">

				<li>

					<!-- BEGIN SIDEBAR TOGGLER BUTTON -->

					<div class="sidebar-toggler hidden-phone"></div>

					<!-- BEGIN SIDEBAR TOGGLER BUTTON -->

				</li>

				<li>

					<!-- BEGIN RESPONSIVE QUICK SEARCH FORM -->

					<form class="sidebar-search">

						<div class="input-box">

							<a href="javascript:;" class="remove"></a>

							<input type="text" placeholder="Search..." />

							<input type="button" class="submit" value=" " />

						</div>

					</form>

					<!-- END RESPONSIVE QUICK SEARCH FORM -->

				</li>

				<li class="start active">

					<a href="${pageContext.request.contextPath}">

					<i class="icon-home"></i> 

					<span class="title">testA</span>

					</a>

				</li>

				<li class=" ">

					<a href="javascript:;">

					<i class="icon-cogs"></i> 

					<span class="title">testB</span>

					<span class="selected"></span>

					<span class="arrow open"></span>

					</a>

					<ul class="sub-menu">

						<li >

							<a href="layout_horizontal_sidebar_menu.html">

							testB-1</a>

						</li>

						<li >

							<a href="layout_horizontal_menu1.html">

							testB-2</a>

						</li>

					</ul>

				</li>
			</ul>
			<!-- END SIDEBAR MENU -->

		</div>

		<!-- END SIDEBAR -->
