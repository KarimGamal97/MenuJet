import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const requestingUser = await serverSupabaseUser(event)
    if (!requestingUser) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const userId = requestingUser.id || (requestingUser as any).sub || (requestingUser as any).user?.id

    const adminClient = serverSupabaseServiceRole(event)

    // Find the caller's profile to get their owner_id
    const { data: callerProfile } = await adminClient
      .from('profiles')
      .select('owner_id, role')
      .or(`id.eq.${userId},user_id.eq.${userId}`)
      .limit(1)
      .single()

    const effectiveId = callerProfile?.owner_id || userId

    // Fetch users that belong to this effectiveId
    const { data: users, error } = await adminClient
      .from('profiles')
      .select('*')
      .or(`id.eq.${effectiveId},owner_id.eq.${effectiveId},user_id.eq.${effectiveId}`)
      .order('full_name', { ascending: true })

    if (error) {
      throw error
    }

    // Populate missing emails from Auth for older accounts
    await Promise.all(
      (users || []).map(async (u) => {
        if (!u.email && u.user_id) {
          try {
            const { data: authUser } = await adminClient.auth.admin.getUserById(u.user_id)
            if (authUser?.user?.email) {
              u.email = authUser.user.email
            }
          } catch (e) {
            // Ignore if we can't fetch the auth user
          }
        }
      })
    )

    return users
  } catch (error: any) {
    console.error('Fetch users error:', error)
    throw createError({ statusCode: 500, message: error.message })
  }
})
