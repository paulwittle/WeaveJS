///<reference path="../typings/react/react.d.ts"/>
///<reference path="../typings/react/react-dom.d.ts"/>
///<reference path="../typings/lodash/lodash.d.ts"/>
///<reference path="../typings/react-vendor-prefix/react-vendor-prefix.d.ts"/>
///<reference path="../typings/react-bootstrap/react-bootstrap.d.ts"/>

import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ui from "./react-ui/ui";
import * as VendorPrefix from "react-vendor-prefix";
import StandardLib from "./utils/StandardLib";
import {Glyphicon} from "react-bootstrap";
import {CSSProperties} from "react";
import {IVisTool, IVisToolProps, IVisToolState} from "./tools/IVisTool";
import ToolTip from "./tools/tooltip";
import {IToolTipProps, IToolTipState} from "./tools/tooltip";
import Slider from "./react-ui/BootstrapSlider/BoostrapSlider";

const toolRegistry:{[name:string]: Function} = {};

declare type IToolTip = React.Component<IToolTipProps, IToolTipState>;

const grabberStyle:CSSProperties = {
    width: "16",
    height: "16",
    cursor: "move",
    background: "url(http://placehold.it/32x32)"
};

export function registerToolImplementation(asClassName:string, jsClass:Function) {
    toolRegistry[asClassName] = jsClass;
}

export function getToolImplementation(asClassName:string):Function {
    return toolRegistry[asClassName];
}

interface IWeaveToolProps extends React.Props<WeaveTool> {
    toolPath:WeavePath;
    toolClass?:string;
    style:CSSProperties;
    onDragStart:React.MouseEvent;
    onDragEnd:React.MouseEvent;
    onDragOver:React.MouseEvent;
}

interface IWeaveToolState {

}

export class WeaveTool extends React.Component<IWeaveToolProps, IWeaveToolState> {

    private toolPath:WeavePath;
    private ToolClass:any;
    private tool:IVisTool;
    private toolWidth:number;
    private toolHeight:number;
    private toolTip:IToolTip;
    private titleBarHeight: number;
    private titleBar:React.Component<ITitleBarProps, ITitleBarState>;

    constructor(props:IWeaveToolProps) {
        super(props);
        this.toolPath = this.props.toolPath;
        var toolType:string = this.toolPath ? this.toolPath.getType() : this.props.toolClass;
        if(toolType === "weave.visualization.tools::ExternalTool" && this.toolPath.getType("toolClass")) {
            toolType = this.toolPath.getState("toolClass");
        }
        if(toolType === "weavejs.core.LinkableHashMap" && this.toolPath.getType("class"))
            toolType = this.toolPath.getState("class");
        this.ToolClass = getToolImplementation(toolType);
        this.titleBarHeight = 25;
    }

    componentDidMount():void {
        // if(this.toolPath) {
        //     this.toolPath.addCallback(this, this.forceUpdate);
        // }
    }

    get title():string {
        return this.tool ? this.tool.title : "";
    }

    render() {
        var toolHeight:number = this.props.style ? this.props.style.height - this.titleBarHeight : 320;
        var toolWidth:number = this.props.style ? this.props.style.width : 320;

        var reactTool:any;
        if (React.Component.isPrototypeOf(this.ToolClass)) {
            reactTool = React.createElement(this.ToolClass, {
                                key: "tool",
                                ref: (c:IVisTool) => { this.tool = c; },
                                toolPath: this.toolPath,
                                style: { height: toolHeight, width: toolWidth },
                                toolTip: this.toolTip
                            }
                        );
        }

        return (
            <ui.VBox style={this.props.style}
                    onMouseEnter={() => { this.titleBar.setState({ showControls: true }); }}
                    onMouseLeave={() => { this.titleBar.setState({ showControls: false }); this.toolTip.setState({ showToolTip: false }); }}
                    onDragOver={this.props.onDragOver}
                    onDragEnd={this.props.onDragEnd}>
                <TitleBar ref={(c:React.Component<ITitleBarProps, ITitleBarState>) => { this.titleBar = c; } }
                          onDragStart={this.props.onDragStart}
                          titleBarHeight={this.titleBarHeight}
                          title={this.title}
                          />
                {
                    <div style={{width: toolWidth, height: toolHeight}}>
                        <div style={{width: "100%", height: "100%", maxHeight: "100%"}}>
                            {/*}<ui.HSlider min={0} max={100} step={10} value={20} onChange={(event:React.FormEvent) => { console.log(event.target["value"]);}}/>
                            <ui.VSlider min={0} max={100} step={1} value={10}/>*/}
                            <Slider/>
                            {
                                reactTool
                            }
                        </div>
                    </div>
                }
                <ToolTip ref={(c:React.Component<IToolTipProps, IToolTipState>) => { this.toolTip = c }}/>
            </ui.VBox>);
    }
}

interface ITitleBarProps extends React.Props<TitleBar> {
    onDragStart:React.MouseEvent;
    titleBarHeight:number;
    title:string;
}

interface ITitleBarState {
    showControls: boolean;
}

class TitleBar extends React.Component<ITitleBarProps, ITitleBarState> {

    constructor(props:ITitleBarProps) {
        super(props);
        this.state = {
            showControls: false
        };
    }
    render() {
        var windowBar:CSSProperties = {
            width: "100%",
            height: this.props.titleBarHeight,
            backgroundColor: this.state.showControls ? "#f8f8f8": ""
        };

        var titleStyle:CSSProperties = {
            cursor: "move",
            height: this.props.titleBarHeight,
            textAlign: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            flex: 1,
            textOverflow: "ellipsis",
            paddingTop: "3"
        };

        var transitions:CSSProperties = {
            visibility: this.state.showControls ? "visible" : "hidden",
            opacity: this.state.showControls ? 0.7 : 0,
            transition: this.state.showControls ? "visibiliy 0s 0.1s, opacity 0.1s linear" : "visibility 0s 0.1s, opacity 0.1s linear"
        };

        var leftControls:CSSProperties = {
            marginLeft: 5,
            marginTop: 2,
            width: 20
        };

        var rightControls:CSSProperties = {
            marginTop: 2,
            width: 38
        };

        StandardLib.merge(leftControls, transitions);
        StandardLib.merge(rightControls, transitions);

        return(
            <ui.HBox ref="header" style={windowBar} draggable={true} onDragStart={this.props.onDragStart}>
            {/*<ui.HBox style={VendorPrefix.prefix({styles: leftControls}).styles}>
            <Glyphicon glyph="cog"/>
            </ui.HBox>*/}
            <span style={titleStyle}>{this.props.title}</span>
            {/*<ui.HBox style={VendorPrefix.prefix({styles: rightControls}).styles}>
            <div style={{marginRight: 5}}>
            <Glyphicon glyph="unchecked"/>
            </div>
            <div style={{marginRight: 5}}>
            <Glyphicon glyph="remove"/>
            </div>
            </ui.HBox>*/}
            </ui.HBox>
        );
    }
}
