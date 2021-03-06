import * as React from "react";
import * as weavejs from "weavejs";
import {Weave} from "weavejs";
import * as _ from "lodash";
import MenuBarItemProps = weavejs.ui.menu.MenuBarItemProps;
import Admin = weavejs.net.Admin;
import {IWeaveMenus} from "weaveapp/menu/IWeaveMenus";
import ServiceLogin from "weaveapp/admin/ServiceLogin";
import SystemMenu from "weaveapp/menu/SystemMenu";
import FileMenu from "weaveapp/menu/FileMenu";
import ChartsMenu from "weaveapp/menu/ChartsMenu";
import DataMenu from "weaveapp/menu/DataMenu";
import ControllersMenu from "weaveapp/menu/ControllersMenu";
import ExternalToolMenu from "weaveapp/menu/ExternalToolMenu";
import {AbstractVisToolImpl} from "weaveapp/tool/AbstractVisTool";
import IVisTool from "weaveapp/api/ui/IVisTool";

export type CreateObjectFunction = (type:Class<IVisTool>)=>void;

export default class WeaveMenus implements IWeaveMenus
{
	context:React.ReactInstance;
	weave:Weave;
	createObject:CreateObjectFunction;
	onFileLoaded:()=>void;
	openDataManager:()=>void;
	enableDataManagerItem:()=>boolean;
	showFileMenu:boolean;
	login:ServiceLogin;
	systemMenu:SystemMenu;
	fileMenu:FileMenu;
	chartsMenu:ChartsMenu;
	dataMenu:DataMenu;
	controllersMenu:ControllersMenu;
	externalToolMenu:ExternalToolMenu;

	constructor(context:React.ReactInstance, weave:Weave, createObject:CreateObjectFunction, onFileLoaded:()=>void, openDataManager:()=>void, enableDataManagerItem:()=>boolean, externalTools?:AbstractVisToolImpl[])
	{
		this.context = context;
		this.weave = weave;
		this.createObject = createObject;
		this.onFileLoaded = onFileLoaded;
		this.openDataManager = openDataManager;
		this.enableDataManagerItem = enableDataManagerItem;

		/* Forces the initialization of the service. */
		/* Hopefully the init flag gets set before our first 'get menu'. */
		Admin.service.getAuthenticatedUser().then(_.noop, _.noop);
		this.login = new ServiceLogin(context, Admin.service);

		this.fileMenu = new FileMenu(this);
		this.systemMenu = new SystemMenu(this);
		this.chartsMenu = new ChartsMenu(this);
		this.dataMenu = new DataMenu(this);
		this.controllersMenu = new ControllersMenu(this);
		this.externalToolMenu = _.isArray(externalTools) && externalTools.length ? new ExternalToolMenu(this, externalTools) : null;
	}

	getMenuList():MenuBarItemProps[]
	{
		var menuList:MenuBarItemProps[] = [this.systemMenu];

		if(this.showFileMenu)
			menuList.push(this.fileMenu);
		else
			menuList.push(this.dataMenu);

		menuList.push(this.chartsMenu, this.controllersMenu);
		if(this.externalToolMenu)
			menuList.push(this.externalToolMenu);

		return menuList;
	}
}
