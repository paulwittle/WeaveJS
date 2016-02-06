/// <reference path="../../../typings/react/react.d.ts"/>

import * as React from "react";
import RCSlider from "./RCSlider";

export interface HSliderProps extends React.Props<HSlider> {
    min?:number;
    max?:number;
    step?:number;
    values?:string[];
    selectedValues?:string[];
    type:string;
    reversed?:boolean;
    onChange?:React.EventHandler<React.FormEvent>;
}

export default class HSlider extends React.Component<HSliderProps, any> {

    constructor(props:HSliderProps) {
        super(props);
    }

    render() {
        return <RCSlider {...this.props}/>;
    }
}
