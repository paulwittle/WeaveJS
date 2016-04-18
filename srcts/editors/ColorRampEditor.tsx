import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import {VBox, HBox} from "../react-ui/FlexBox";
import {VSpacer, HSpacer} from "../react-ui/Spacer";
import ColorRampList from "../ui/ColorRampList";
import ColorRampComponent from "../react-ui/ColorRamp";
import ColorPicker from "../react-ui/ColorPicker";
import List from "../react-ui/List";
import CenteredIcon from "../react-ui/CenteredIcon";
import Button from "../semantic-ui/Button";
import ComboBox from "../semantic-ui/ComboBox";
import ReactUtils from "../utils/ReactUtils";

import ColorRamp = weavejs.util.ColorRamp;
import LinkableWatcher = weavejs.core.LinkableWatcher;
import StandardLib = weavejs.util.StandardLib;

export interface ColorRampEditorProps extends React.Props<ColorRampEditor>
{
		colorRamp:ColorRamp;
		compact?:boolean;
		onButtonClick?:React.MouseEventHandler;
}

export interface ColorRampEditorState 
{
		selectedFilter:string;
}

const ALL:string = "All";
// stub
export default class ColorRampEditor extends React.Component<ColorRampEditorProps, ColorRampEditorState>
{
	private colorRampWatcher:LinkableWatcher = Weave.disposableChild(this, new LinkableWatcher(ColorRamp, null, this.forceUpdate.bind(this)));
	public get colorRamp():ColorRamp { return this.colorRampWatcher.target as ColorRamp; }
	public set colorRamp(value:ColorRamp) { this.colorRampWatcher.target = value; }
	
	private filterOptions:string[];
	
	constructor(props:ColorRampEditorProps)
	{
		super(props);
		this.state = {
			selectedFilter: ALL
		};

		this.colorRamp = props.colorRamp;
		this.filterOptions = [];
		var tagsLookup:{[tag:string]:string} = {};
		for(var ramp of ColorRamp.allColorRamps)
			for(var tag of ramp.tags.split(","))
				if(!tagsLookup[tag])
					this.filterOptions.push(tagsLookup[tag] = tag);
		
		this.filterOptions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
		this.filterOptions.unshift(ALL);
	}
		
	updateColorsAtIndex(index:number, color:string)
	{
		var colors = this.colorRamp.getColors() as number[];
		colors[index] = StandardLib.asNumber(color);
		this.colorRamp.setSessionState(colors)
	}
	
	removeColorAtIndex(index:number)
	{
		var colors:number[] = this.colorRamp.getColors() as number[];
		colors.splice(index, 1);
		this.colorRamp.setSessionState(colors)
	}
	
	addColor=()=>
	{
		var colors:number[] = this.colorRamp.getColors() as number[];
		colors.push(StandardLib.asNumber("#FFFFFF"));
		this.colorRamp.setSessionState(colors);
	}
	
	reverseColors=()=>
	{
		this.colorRamp.reverse();
	}
	
	handleColorRampSelectionChange = (newColors:number[]) =>
	{
		this.colorRamp.setSessionState(newColors);
	}
	
	renderCompactView()
	{
		return ReactUtils.generateTable(
			null,
			[
				[ 
					Weave.lang("Color Theme"),
					<HBox className="weave-padded-hbox" style={{padding: 0, alignItems: "center"}}>
						<ColorRampComponent style={{height: 20, marginRight: 5, flex: 1}} ramp={this.colorRamp.getHexColors()}/>
						<Button onClick={this.props.onButtonClick}>{Weave.lang("Edit")}</Button>
					</HBox>
				],
			],
			{
				table: {width: "100%"},
				td: [{whiteSpace: "nowrap", fontSize: "smaller"}, {padding: 5, width: "100%"}]
			}
		)
	}

	renderFullView()
	{
		var colors:number[] = this.colorRamp.getColors() as number[];
		var hexColors = this.colorRamp.getHexColors();
		
		var filteredRamps = this.state.selectedFilter == ALL ? ColorRamp.allColorRamps : ColorRamp.allColorRamps.filter((v) => v.tags.indexOf(this.state.selectedFilter) >= 0);
		
		var listOptions = hexColors.map((hexColor, index) => {
			return {
				value: index,
				label: (
					<HBox style={{flex: 1, justifyContent: "space-between", verticalAlign: "middle"}}>
						<HBox>
							<ColorPicker hexColor={hexColor} onClose={(newColor:string) => this.updateColorsAtIndex(index, newColor)}/>
							<VSpacer/>
							<span style={{alignSelf: "center", fontFamily: "monospace"}}>{hexColor.toUpperCase()}</span>
						</HBox>
						<CenteredIcon iconProps={{className: "fa fa-times fa-fw"}} onClick={() => this.removeColorAtIndex(index)}/>
					</HBox>
				)
			}
		})
		return (
			<VBox style={{flex: 1}}>
				<HBox style={{flex: 1}}>
					<HBox style={{flex: .7}}>
						<ColorRampList selectedColors={colors} allColorRamps={filteredRamps} onChange={this.handleColorRampSelectionChange}/>
					</HBox>
					<VSpacer/>
					<VBox style={{flex: .3}}>
						<label style={{marginTop: 5, fontWeight: "bold"}}>{Weave.lang("Customize")}</label>
						<HSpacer/>
						<HBox style={{flex: 1, overflow: "auto"}}>
							<ColorRampComponent style={{width: 30}} direction="to bottom" ramp={hexColors}/>
							<VSpacer/>
							<List options={listOptions}/>
						</HBox>
					</VBox>
					<HSpacer/>
				</HBox>
				<HSpacer/>
				<HBox>
					<HBox style={{flex: .7, alignItems: "center"}}>
						{Weave.lang("Filter: ")}
						<VSpacer/>
						<ComboBox fluid={false} value={this.state.selectedFilter} options={this.filterOptions} onChange={(value:string) => { this.setState({ selectedFilter: value}) }} direction="upward"/>
					</HBox>
					<VSpacer/>
					<HBox style={{flex: .3, justifyContent: "space-between"}}>
						<CenteredIcon onClick={this.reverseColors}>{'↓↑'}</CenteredIcon>
						<Button onClick={this.addColor}>{Weave.lang("Add color")}</Button>
					</HBox>
				</HBox>
				<HSpacer/>
			</VBox>
		)
	}
	
	render()
	{
		return this.props.compact ? this.renderCompactView() : this.renderFullView();
	}
}
