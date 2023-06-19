import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { getHttpRequest } from "../../../axios/index";
import { Link } from "react-router-dom";
import { CButton } from "@coreui/react";
const CommentList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    getHttpRequest("v1/admin/review")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  const renderContent = (row) => (
    <div
      dangerouslySetInnerHTML={{
        __html: row.content,
      }}
    />
  );
  const columns = [
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Rating",
      selector: "rating",
      sortable: true,
    },
    {
      name: "Content",
      cell: (row) => renderContent(row),
    },
    {
      name: "Category",
      selector: "category",
      sortable: true,
    },
  ];

  return (
    <div>
      <Link to="/app/create-comments">
        <CButton color="primary">Create Comment</CButton>
      </Link>
      <DataTable title="Reviews" columns={columns} data={reviews} pagination />
    </div>
  );
};

export default CommentList;
