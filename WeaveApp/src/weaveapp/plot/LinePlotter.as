/* ***** BEGIN LICENSE BLOCK *****
 *
 * This file is part of Weave.
 *
 * The Initial Developer of Weave is the Institute for Visualization
 * and Perception Research at the University of Massachusetts Lowell.
 * Portions created by the Initial Developer are Copyright (C) 2008-2015
 * the Initial Developer. All Rights Reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * ***** END LICENSE BLOCK ***** */

namespace weavejs.plot
{
	import Graphics = PIXI.Graphics;
	import Point = weavejs.geom.Point;
	
	import DynamicState = weavejs.api.core.DynamicState;
	import IQualifiedKey = weavejs.api.data.IQualifiedKey;
	import Bounds2D = weavejs.geom.Bounds2D;
	import AlwaysDefinedColumn = weavejs.data.column.AlwaysDefinedColumn;
	import DynamicColumn = weavejs.data.column.DynamicColumn;
	import SolidLineStyle = weavejs.plot.SolidLineStyle;

	/**
	 * This plotter plots lines using x1,y1,x2,y2 values.
	 * There is a set of data coordinates and a set of screen offset coordinates.
	 */
	export class LinePlotter extends AbstractPlotter
	{
		public constructor()
		{
			this.setColumnKeySources([this.x1Data, this.y1Data, this.x2Data, this.y2Data]);
			this.addSpatialDependencies(this.x1Data, this.y1Data, this.x2Data, this.y2Data);
		}

		// spatial properties
		/**
		 * This is the beginning X data value associated with the line.
		 */
		public x1Data:DynamicColumn = Weave.linkableChild(this, DynamicColumn);
		/**
		 * This is the beginning Y data value associated with the line.
		 */
		public y1Data:DynamicColumn = Weave.linkableChild(this, DynamicColumn);
		/**
		 * This is the ending X data value associated with the line.
		 */
		public x2Data:DynamicColumn = Weave.linkableChild(this, DynamicColumn);
		/**
		 * This is the ending Y data value associated with the line.
		 */
		public y2Data:DynamicColumn = Weave.linkableChild(this, DynamicColumn);

		// visual properties
		/**
		 * This is an offset in screen coordinates when projecting the line onto the screen.
		 */
		public x1ScreenOffset:AlwaysDefinedColumn = Weave.linkableChild(this, new AlwaysDefinedColumn(0));
		/**
		 * This is an offset in screen coordinates when projecting the line onto the screen.
		 */
		public y1ScreenOffset:AlwaysDefinedColumn = Weave.linkableChild(this, new AlwaysDefinedColumn(0));
		/**
		 * This is an offset in screen coordinates when projecting the line onto the screen.
		 */
		public x2ScreenOffset:AlwaysDefinedColumn = Weave.linkableChild(this, new AlwaysDefinedColumn(0));
		/**
		 * This is an offset in screen coordinates when projecting the line onto the screen.
		 */
		public y2ScreenOffset:AlwaysDefinedColumn = Weave.linkableChild(this, new AlwaysDefinedColumn(0));
		/**
		 * This is the line style used to draw the line.
		 */
		public line:SolidLineStyle = Weave.linkableChild(this, SolidLineStyle);

		/**
		 * This function returns a Bounds2D object set to the data bounds associated with the given record key.
		 * @param key The key of a data record.
		 * @param outputDataBounds A Bounds2D object to store the result in.
		 */
		/*override*/ public getDataBoundsFromRecordKey(recordKey:IQualifiedKey, output:Bounds2D[]):void
		{
			this.initBoundsArray(output, 2);
			output[0].includeCoords(
					this.x1Data.getValueFromKey(recordKey, Number),
					this.y1Data.getValueFromKey(recordKey, Number)
				);
			output[1].includeCoords(
					this.x2Data.getValueFromKey(recordKey, Number),
					this.y2Data.getValueFromKey(recordKey, Number)
				);
		}

		/**
		 * This function may be defined by a class that extends AbstractPlotter to use the basic template code in AbstractPlotter.drawPlot().
		 */
		/*override*/ protected addRecordGraphics(recordKey:IQualifiedKey, dataBounds:Bounds2D, screenBounds:Bounds2D, buffer:Graphics):void
		{
			var graphics:Graphics = tempShape.graphics;

			// project data coordinates to screen coordinates and draw graphics onto tempShape
			this.line.beginLineStyle(recordKey, graphics);				
			
			// project data coordinates to screen coordinates and draw graphics
			LinePlotter.tempPoint.x = this.x1Data.getValueFromKey(recordKey, Number);
			LinePlotter.tempPoint.y = this.y1Data.getValueFromKey(recordKey, Number);
			dataBounds.projectPointTo(LinePlotter.tempPoint, screenBounds);
			LinePlotter.tempPoint.x += this.x1ScreenOffset.getValueFromKey(recordKey, Number);
			LinePlotter.tempPoint.y += this.y1ScreenOffset.getValueFromKey(recordKey, Number);
			
			graphics.moveTo(LinePlotter.tempPoint.x, LinePlotter.tempPoint.y);
			
			LinePlotter.tempPoint.x = this.x2Data.getValueFromKey(recordKey, Number);
			LinePlotter.tempPoint.y = this.y2Data.getValueFromKey(recordKey, Number);
			dataBounds.projectPointTo(LinePlotter.tempPoint, screenBounds);
			LinePlotter.tempPoint.x += this.x2ScreenOffset.getValueFromKey(recordKey, Number);
			LinePlotter.tempPoint.y += this.y2ScreenOffset.getValueFromKey(recordKey, Number);
			
			graphics.lineTo(LinePlotter.tempPoint.x, LinePlotter.tempPoint.y);
		}
		
		private static tempPoint:Point = new Point(); // reusable object
		
		/*[Deprecated(replacement="line")] public set lineStyle(value:Object):void
		{
			try
			{
				Weave.setState(line, value[0][DynamicState.SESSION_STATE]);
			}
			catch (e)
			{
				console.error(e);
			}
		}*/
	}
}

