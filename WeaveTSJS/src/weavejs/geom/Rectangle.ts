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

namespace weavejs.geom
{
	export class Rectangle
	{
		constructor(x:number = NaN, y:number = NaN, width:number = NaN, height:number = NaN)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}
		public x:number;
		public y:number;
		public width:number;
		public height:number;
	}
}
