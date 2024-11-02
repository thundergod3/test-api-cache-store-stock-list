const dayjs = require("dayjs");
const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  const itemNo = req?.query?.item_no;
  const isDisabled = req?.query?.is_disabled;
  const sessionId = req?.query?.session_id;
  const storeName = req?.query?.store_name;
  const response = await fetch(
    `${
      process.env.POS_API_ENDPOINT
    }/GetPosStroreStockList/01?dayname=${dayjs().format(
      "dddd"
    )}&logindate=${dayjs().format(
      "YYYY-MM-DD"
    )}&sessionid=${sessionId}&storename=${storeName}`
  );
  const result = await response.json();
  const data = result?.data?.[0]?.output;

  let newData = JSON.parse(data || "[]");

  newData = newData?.map((record) => {
    if (record?.item_category === itemNo) {
      return {
        ...record,
        is_emenu_disable: isDisabled,
      };
    }

    return record;
  });

  res.json({ data: JSON.stringify(newData) });
});

module.exports = router;
