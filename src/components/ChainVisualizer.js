import React, { useState, useEffect, useRef } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from "react-force-graph";

const ChainVisualizer = (data) => {
	const nodePaint = ({ id, x, y }, color, ctx) => {
		ctx.fillStyle = color;
		[
			() => {
				ctx.fillRect(x - 6, y - 4, 12, 8);
			}, // rectangle
			() => {
				ctx.beginPath();
				ctx.moveTo(x, y - 5);
				ctx.lineTo(x - 5, y + 5);
				ctx.lineTo(x + 5, y + 5);
				ctx.fill();
			}, // triangle
			() => {
				ctx.beginPath();
				ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
				ctx.fill();
			}, // circle
			() => {
				ctx.font = "10px Sans-Serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText("Text", x, y);
			}, // text
		][id % 4]();
	};

	const colors = ["#8F0380", "#EC205B", "#FC7208", "#D00204", "#7701AD"];
	// gen a number persistent color from around the palette
	const getColor = (id) => {
		const colorIndex = walletAddressToArrayIndex(id, colors.length);
		return colors[colorIndex];
	};

	const walletAddressToArrayIndex = (address, arrayLength) => {
		const addressArray = [...address];
		let totalNums = 0;

		for (let i = 0; i < addressArray.length; i++) {
			let isNum = parseInt(addressArray[i]);
			if (isNum) {
				totalNums += addressArray[i];
			}
		}
		return Math.floor(totalNums % arrayLength);
	};

	const graphWidth = 500;
	const graphHeight = 500;
	const linkColor = "#FC7208";

	const getGraphData = () => {
		if (data.data) {
			return data.data;
		}
		const tempData = {
			nodes: [
				{ id: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB" },
				{ id: "0x0000000000000000000000000000000000000000" },
				{ id: "0x0000000000000000000000000000000000000001" },
				{ id: "0x000000000000000000000000000000000000dead" },
				{ id: "0x00000000000000000000005cda7ec9514b4f5959" },
				{ id: "0x00014f7b477698b15f7c87bb778edf3b65d2967f" },
			],
			links: [
				{
					source: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
					target: "0x0000000000000000000000000000000000000000",
				},
				{
					source: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
					target: "0x0000000000000000000000000000000000000001",
				},
				{
					source: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
					target: "0x000000000000000000000000000000000000dead",
				},
				{
					source: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
					target: "0x00000000000000000000005cda7ec9514b4f5959",
				},
				{
					source: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
					target: "0x00014f7b477698b15f7c87bb778edf3b65d2967f",
				},
			],
		};
		return tempData;
	};

	return (
		<div className="w-500px h-500px bg-background ">
			<ForceGraph3D
				width={graphWidth}
				linkColor="#FFC0CB"
				height={graphHeight}
				backgroundColor="#12082D"
				graphData={getGraphData()}
				nodeColor={(node, ctx) => getColor(node.id)}
			/>
		</div>
	);
};

export default ChainVisualizer;
