import * as React from "react";
import Menu from "./Menu";
import {MenuItemProps} from "./Menu";
import ReactUtils from "../utils/ReactUtils";

export interface MenuButtonProps extends React.Props<MenuButton>
{
	menu:MenuItemProps[];
}

export interface MenuButtonState
{
	
}

export default class MenuButton extends React.Component<MenuButtonProps, MenuButtonState>
{
	element:HTMLElement;
	menu:Menu;
	constructor(props:MenuButtonProps)
	{
		super(props)
	}
	
	closeMenu=()=>
	{
		if(this.menu)
		{
			ReactUtils.closePopup(this.menu);
			this.menu = null;
		}
	}

	openMenu=()=>
	{
		var clientRect = this.element.getBoundingClientRect();
		// close the popup if it was already open
		if(this.menu)
		{
			this.closeMenu();
		}
		else
		{
			this.menu = ReactUtils.openPopup(
				<Menu menu={this.props.menu} 
					xPos={clientRect.left} 
					yPos={clientRect.top+this.element.clientHeight}
					onClick={this.closeMenu}
				/>,
				true
			) as Menu;
		}
	}
	
	render():JSX.Element
	{
		return (
			<button ref={(elt:Element) => this.element = elt as HTMLElement} onMouseDown={this.openMenu}>
				<i className="fa fa-bars"/>
			</button>
		);
	}
}
