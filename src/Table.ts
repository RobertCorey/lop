import { Table } from "@chevtek/poker-engine";

const table = new Table();
table.sitDown("" + Math.random(), 1000);
table.sitDown("" + Math.random(), 1000);
table.sitDown("" + Math.random(), 1000);
table.dealCards();

export { table };
