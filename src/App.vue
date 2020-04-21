<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<style lang="less">
	@import "./assets/css/main.css";
	@import "./assets/css/color-dark.css";
	/*深色主题*/
	/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
	//修改element原生样式
	.el-menu-item [class*=iconfont-] {
		margin-right: 5px;
		margin-left: 4px;
		width: 24px;
		text-align: center;
		font-size: 18px;
		vertical-align: middle;
	}
	.el-dialog__body{
		padding: 0 20px 30px 20px !important;
	}
	.el-card__body{padding: 10px !important;}
	//修改element原生样式
	.placeholderLine1{height: 1px;}
	.placeholderLine{height: 4px;}
	.placeholderLine10{height: 10px;}
	.placeholderLine16{height: 16px;}
	.placeholderLine20{height: 20px;}
	.placeholderLine40{height: 40px;}
	.underline{text-decoration: underline;}
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}
	.placeholderVertical{width: 10px;height: 10px;padding-left: 4px;padding-right: 4px;color: #0080FF;}
	.placeholderLine{height: 10px;}
	.width80{width: 80px !important;}.width100{width: 100px !important;}.width120{width: 120px !important;}.width140{width: 140px !important;}.width160{width: 160px !important;}.width200 {width: 200px !important;}.width220{width: 220px;}.width240{width: 240px;}
	.width260{width: 260px;}.width280{width: 280px;}.width300 {width: 300px !important;}
	.width400 {width: 400px !important;}
	.margint{margin-top: 6px;}.marginb{margin-bottom: 6px;}
	.margL10{margin-left: 10px;}.margL12{margin-left: 12px;}.margR20{margin-right: 20px;}
	.margT3{margin-top: 3px;}.margT6{margin-top: 6px;}.margT8{margin-top: 8px;}.margT10{margin-top: 10px;}.margT20{margin-top: 20px;}
	.margL10{margin-left: 10px;}.margL20{margin-left: 20px;}.margL40{margin-left: 40px;}
	.margL100{margin-left: 100px;}.margL200{margin-left: 200px;}
	.paddingT20{padding-top: 30px;}
	.inline{display: inline-block;}
	.cursor{cursor: pointer;}
	.hidden{overflow: hidden;}
	.left{float: left;}
	.right{float: right;}
	.clear{clear: both;}
	.block{display: block;}
	.textCenter{text-align: center;}
	.textLeft{text-align: left;}
  .em13{line-height: 1.3em;}
	.ellipsis{
	  overflow: hidden;  /*溢出隐藏*/
	  text-overflow: ellipsis; /*以省略号...显示*/
	  white-space: nowrap;  /*强制不换行*/
	}
	//颜色
	.textTitle{color: #323232 !important; font-weight: bold;}
	.textContent{color: #646464 !important;}
	.textAdorn{color: #c7c7c7 !important;}
	.red{color: red;}
	.green{color: green;}
	.gray{color: #c7c7c7;}
	.blue{color: #409EFF;}
	.warn_text{color: rgb(211, 0, 0);}
	.green_text{color: #07961f;}
	//字体
	.lineHeight{line-height: 1.3em;}
	.f-10{font-size: 10px !important;}
	.f-11{font-size: 11px !important;}
	.f-12{font-size: 12px !important;}
	.star_red{
	  color: rgb(221, 0, 0);
	  font-size: 12px;
	}
  .bg_blue {
    background: rgb(45, 140, 240);
  }
  
  .bg_green {
    background: rgb(100, 213, 114);
  }
  
  .bg_red {
    background: rgb(242, 94, 67);
  }
	.intervals{
	  height: 24px;
	  line-height: 24px;
	}
	.intervals4opetate{
	  height: 48px;
	  line-height: 36px;
	}
	.dialog_body{
	  padding-bottom: 20px;
	}
	.dialog_input_width{
	  width: 70%;
	}
	.mask{
	  position: absolute;
	  left: 0;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, 0.5);
	  z-index: 999;
	}
	.imageBox{
		display: inline-block;
		.item{
			width: 200px;
			height: 280px;
			margin-right: 6px;
		}
	}
</style>
