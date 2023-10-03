import { useDispatch } from "react-redux";
import { useRouteLoaderData } from "react-router-dom";

import styles from "./Categories.module.css";
import { categoryActions } from "../../../redux-store/category";
import { useEffect } from "react";

const Categories = () => {
  const data = useRouteLoaderData("layout");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(categoryActions.switchCatogory(data));
  }, [data, dispatch]);

  const clickHandler = (event) => {
    const parag = document.querySelectorAll("fieldset span");
    // Đầu tiên, xóa class active trên tất cả
    parag.forEach((span) => {
      span.classList.remove("active");
    });

    // add class
    event.target.classList.add("active");


    const category = event.target.getAttribute("category");

    if (category === "all") {
      dispatch(categoryActions.switchCatogory(data));
      return;
    }

    const categoryData = data.filter((mov) => {
      return mov.category === category;
    });

    // send action
    dispatch(categoryActions.switchCatogory(categoryData));
  };

  return (
    <fieldset className={styles.categories}>
      <h2>Categories</h2>
      <div>
        <article>
          <h4>Apple</h4>
          <span category="all" className="active" onClick={clickHandler}>
            All
          </span>
        </article>

        <article>
          <h5>Iphone & Mac</h5>
          <span category="iphone" onClick={clickHandler} name="iphone">
            Iphone
          </span>
          <span category="ipad" onClick={clickHandler}>
            Ipad
          </span>
          <span category="macbook" onClick={clickHandler}>
            MacBook
          </span>
        </article>

        <article>
          <h5>Wireless</h5>
          <span category="airpod" onClick={clickHandler}>
            Airpod
          </span>
          <span category="watch" onClick={clickHandler}>
            Watch
          </span>
        </article>

        <article>
          <h5>Other</h5>
          <span category="mouse" onClick={clickHandler}>
            Mouse
          </span>
          <span category="keyboard" onClick={clickHandler}>
            Keyboard
          </span>
          <span category="other" onClick={clickHandler}>
            Other
          </span>
        </article>
      </div>
    </fieldset>
  );
};

export default Categories;
