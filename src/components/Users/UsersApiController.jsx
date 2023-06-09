/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo } from 'react'
import { Users } from './Users'
import { Preloader } from './Preloader'
import { getUser } from '../../api/api'


export const UsersApiController = ({
  users,
  toggleFollow,
  setUsers,
  pageSize,
  totalUsersCount,
  currentPage,
  setCurrentPage,
  isFetching,
  setIsFetching }) => {

  const pages = useMemo(() => {
    const pagesCount = Math.ceil(totalUsersCount / pageSize)
    let pagesArr = []
    for (let i = 1; i <= pagesCount; i++) {
      pagesArr.push(i)
    }

    return pagesArr
  }, [totalUsersCount, pageSize])


  useEffect(() => {
    if (users.length !== 0) return
    setIsFetching(true)

    const controller = new AbortController();
    const params = new URLSearchParams({
      count: pageSize,
    }).toString()

    getUser(params, controller.signal)
      .then(({ data }) => {
        setIsFetching(false)
        setUsers(data.items)
      })

    return () => controller.abort();

  }, [])

  const handleFollowClick = (id) => () => toggleFollow(id)

  const setPage = (pageNumber) => () => {
    setCurrentPage(pageNumber)
    setIsFetching(true)

    const params = new URLSearchParams({
      count: pageSize,
      page: pageNumber,
    }).toString()

    getUser(params)
      .then(({ data }) => {
        setIsFetching(false)
        setUsers(data.items)
      })
  }

  return (
    <>
      {!isFetching
        ? (<Users
          pages={pages}
          setPage={setPage}
          currentPage={currentPage}
          users={users}
          handleFollowClick={handleFollowClick}
        />) : <Preloader />}
    </>

  )
}