const express = require("express");
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");

const Book = require("../schemas/book");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    status: 200,
    message: "success",
  });
});

const getHtml = async (idx) => {
  try {
    return await axios.get(
      `https://www.aladin.co.kr/shop/common/wbest.aspx?BranchType=1&BestType=NowBest&page=${
        idx + 1
      }`
    );
  } catch (error) {
    console.error(error);
  }
};

router.get("/refresh", async (req, res) => {
  Book.deleteMany({}).then(() => {
    console.log("😱 book db initialized 😱");
  });
  var idx = 0;

  await getHtml(idx).then((html) => {
    const $ = cheerio.load(html.data);
    let parentTag = $("div.ss_book_list:first-child");
    // let parentTag = $(
    //   "div.newbg_wrap2 > table > tbody > tr > td > div.newbg_body > form > div.ss_book_box"
    // );
    // console.log("parentTag.tr:");
    // console.log(parentTag);
    // console.log("------------\nresultArr:");
    parentTag.each((i, elem) => {
      tmp = $($(elem).find("ul").html()).length;
      //   console.log(tmp);
      //   console.log($(elem).find("span.ss_p2").text());

      if (tmp !== 8) {
        author = $(elem).find("ul > li:nth-child(2)> a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(2)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      } else {
        author = $(elem).find("ul > li:nth-child(3) > a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(3)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      }
      if (author === "") {
        author = $(elem).find("ul > li:nth-child(3) > a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(3)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      }
      if (author === "") {
        author = $(elem).find("ul > li:nth-child(2)> a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(2)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      }

      const newBook = new Book({
        rank: 50 * idx + i + 1,
        bookname: $(elem)
          .find("a.bo3")
          .text()
          .replace(/[\n\t]/g, ""),
        author: author,
        publisher: publisher,
        price: price,
      });
      //   console.log(newBook);
      newBook.save().then(() => {
        // console.log(newBook);
      });
    });

    // console.log(resultArr);
  });

  // 2페이지
  idx = 1;
  await getHtml(idx).then((html) => {
    const $ = cheerio.load(html.data);
    let parentTag = $("div.ss_book_list:first-child");
    // let parentTag = $(
    //   "div.newbg_wrap2 > table > tbody > tr > td > div.newbg_body > form > div.ss_book_box"
    // );
    // console.log("parentTag.tr:");
    // console.log(parentTag);

    // console.log("------------\nresultArr:");
    parentTag.each((i, elem) => {
      tmp = $($(elem).find("ul").html()).length;

      if (tmp !== 8) {
        author = $(elem).find("ul > li:nth-child(2)> a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(2)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      } else {
        author = $(elem).find("ul > li:nth-child(3) > a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(3)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      }
      if (author === "") {
        author = $(elem).find("ul > li:nth-child(3) > a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(3)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      }
      if (author === "") {
        author = $(elem).find("ul > li:nth-child(2)> a:first-child").text();
        publisher = $(elem).find("ul > li:nth-child(2)> a:last-child").text();
        price = $(elem).find("span.ss_p2").text();
      }

      //   console.log(i + 1, publisher);
      //   resultArr.push({
      //     rank: 50 * idx + i + 1,
      //     bookname: $(elem)
      //       .find("a.bo3")
      //       .text()
      //       .replace(/[\n\t]/g, ""),
      //     author: author,
      //     publisher: publisher,
      //     price: price,
      //   });
      const newBook = new Book({
        rank: 50 * idx + i + 1,
        bookname: $(elem)
          .find("a.bo3")
          .text()
          .replace(/[\n\t]/g, ""),
        author: author,
        price: price,
        publisher: publisher,
      });
      //   console.log(newBook);
      newBook.save().then(() => {
        // console.log(newBook);
      });
    });

    // console.log(resultArr);
  });

  return res.json({
    status: 200,
    message: "success",
  });
});

router.get("/get", async (req, res) => {
  var tmp = await Book.find({}).sort({ _id: 1 });
  return res.json({
    status: 200,
    message: "getting book success",
    tmp,
  });
});

router.post("/search", async (req, res) => {
  console.log(req.body);
  var searchVal = req.body.searchVal;
  var searchOpt = req.body.searchOption;
  if (searchOpt === "bookname")
    var ret_list = await Book.find({ bookname: searchVal });
  else if (searchOpt === "author")
    var ret_list = await Book.find({ author: searchVal });
  else if (searchOpt === "publisher")
    var ret_list = await Book.find({ publisher: searchVal });
  console.log(searchVal);
  return res.json({
    message: "success",
    ret_list,
  });
});

module.exports = router;
