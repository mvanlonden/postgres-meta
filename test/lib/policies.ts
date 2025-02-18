import { pgMeta } from './utils'

test('list', async () => {
  const res = await pgMeta.policies.list()
  expect(res.data?.find(({ name }) => name === 'categories_update_policy')).toMatchInlineSnapshot(
    { id: expect.any(Number), table_id: expect.any(Number) },
    `
    Object {
      "action": "PERMISSIVE",
      "check": null,
      "command": "UPDATE",
      "definition": "(current_setting('my.username'::text) = name)",
      "id": Any<Number>,
      "name": "categories_update_policy",
      "roles": Array [
        "postgres",
      ],
      "schema": "public",
      "table": "category",
      "table_id": Any<Number>,
    }
  `
  )
})

test('retrieve, create, update, delete', async () => {
  let res = await pgMeta.policies.create({
    name: 'test policy',
    schema: 'public',
    table: 'memes',
    action: 'RESTRICTIVE',
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "action": "RESTRICTIVE",
        "check": null,
        "command": "ALL",
        "definition": null,
        "id": Any<Number>,
        "name": "test policy",
        "roles": Array [
          "public",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.retrieve({ id: res.data!.id })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "action": "RESTRICTIVE",
        "check": null,
        "command": "ALL",
        "definition": null,
        "id": Any<Number>,
        "name": "test policy",
        "roles": Array [
          "public",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.update(res.data!.id, {
    name: 'policy updated',
    definition: "current_setting('my.username') IN (name)",
    check: "current_setting('my.username') IN (name)",
    roles: ['postgres'],
  })
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "action": "RESTRICTIVE",
        "check": "(current_setting('my.username'::text) = name)",
        "command": "ALL",
        "definition": "(current_setting('my.username'::text) = name)",
        "id": Any<Number>,
        "name": "policy updated",
        "roles": Array [
          "postgres",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.remove(res.data!.id)
  expect(res).toMatchInlineSnapshot(
    {
      data: {
        id: expect.any(Number),
        table_id: expect.any(Number),
      },
    },
    `
    Object {
      "data": Object {
        "action": "RESTRICTIVE",
        "check": "(current_setting('my.username'::text) = name)",
        "command": "ALL",
        "definition": "(current_setting('my.username'::text) = name)",
        "id": Any<Number>,
        "name": "policy updated",
        "roles": Array [
          "postgres",
        ],
        "schema": "public",
        "table": "memes",
        "table_id": Any<Number>,
      },
      "error": null,
    }
  `
  )
  res = await pgMeta.policies.retrieve({ id: res.data!.id })
  expect(res).toMatchObject({
    data: null,
    error: {
      message: expect.stringMatching(/^Cannot find a policy with ID \d+$/),
    },
  })
})
