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

namespace weavejs.api.data
{
	/**
	 * This is an interface for an object which references a URL.
	 * It is intended to be used in conjunction with IWeaveTreeNode.
	 */
	export class IExternalLink
	{
		static WEAVE_INFO = Weave.setClassInfo(IExternalLink, {
			id: "weavejs.api.data.IExternalLink"
		});

		/**
		 * Gets the URL associated with this object.
		 * @return The URL.
		 */
		getURL:()=>string;
	}
}
