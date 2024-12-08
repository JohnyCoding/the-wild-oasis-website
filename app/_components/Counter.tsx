"use client";
import { useState } from "react";

export default function Counter() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount((curr) => curr + 1)}>{count}</button>;
}
